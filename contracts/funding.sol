pragma solidity ^0.4.24;

contract FundingFactory {
    // 平台管理员
    address public platformManager;
    // 所有众筹合约的集合
    address[] allFundings;
    // 自己创建的合约集合
    mapping(address => address[]) creatorFundings;
    // 参与过的合约集合：
    SupportFunding supportFunding;

    constructor() public {
        platformManager = msg.sender;
        supportFunding = new SupportFunding();
    }

    // 创建众筹合约
    function createFunding(string _name, uint256 _targetMoney, uint256 _supportMoney, uint256 _duration) public {
        // address funding = new Funding(_name, _targetMoney, _supportMoney, _duration, msg.sender);
        address funding = new Funding(_name, _targetMoney, _supportMoney, _duration, msg.sender, supportFunding);
        allFundings.push(funding);
        creatorFundings[msg.sender].push(funding);
    }

    // 获取所有众筹合约
    function getAllFundings() public view returns(address[]) {
        return allFundings;
    }

    // 获取创建者的众筹合约
    function getCreatorFunding() public view returns(address[]) {
        return creatorFundings[msg.sender];
    }

     // 获取参与者的众筹合约
    function getSupportorFunding() public view returns(address[]) {
        return supportFunding.getFundings(msg.sender);
    }

}


// 该合约维护了所有参与者所参与过的众筹合约
contract SupportFunding {
    // 参与过的合约集合：
    mapping(address => address[]) supportFundingsMap;

    // 添加合约到集合
    function setFunding(address _supportor, address _funding) public {
        supportFundingsMap[_supportor].push(_funding);
    }

    // 读取合约数据
    function getFundings(address _supportor) public view returns(address[]) {
        return supportFundingsMap[_supportor];
    }

}


contract Funding {
    // 管理员
    address public manager;
    // 项目名
    string public projectName;
    // 筹集金额
    uint256 public targetMoney;
    // 平均支持的金额
    uint256 public supportMoney;
    // 项目结束时间,单位秒
    uint256 public endTime;
    // 参与者
    address[] investors;
    // 花费申请的状态，0：进行中，1：已批准，2：已完成
    enum RequestStatus {
        Voting, Approved, Completed
    }

    SupportFunding supportFunding;

    // 记录请求申请的信息
    struct Request {
        // 花费申请的目的
        string purpose;
        // 所需金额
        uint256 cost;
        // 商家地址
        address seller;
        // 以赞成的票数
        uint256 approveCount;
        // 申请状态
        RequestStatus status;
        // 记录参与者的投票状态，true代表已经投过，false代表还没投票
        mapping(address => bool) isVotedMap;
    }

    constructor(string _projectName, uint256 _targetMoney, uint256 _supportMoney, uint256 _duration, address _creator, SupportFunding _supportFunding) public {
        manager = _creator;
        projectName = _projectName;
        targetMoney = _targetMoney * 10**18;
        supportMoney = _supportMoney * 10**18;
        // 合约创建时间 + 持续时间 = 结束时间
        endTime = block.timestamp + _duration;

        supportFunding = _supportFunding;
    }

    // 定义一个mapping，记录投资人的地址，方便判断一个地址是否是投资人的地址。
    mapping(address => bool) isInvestorMap;

    // 参与众筹
    function invest() public payable returns(uint256) {
        require(msg.value == supportMoney);
        investors.push(msg.sender);
        isInvestorMap[msg.sender] = true;
        // 保存用户参与过的众筹
        supportFunding.setFunding(msg.sender, this);
    }

    // 获取筹集到的金额
    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }

    // 获取所有参与者
    function getInvestors() public view returns(address[]) {
        return investors;
    }

    // 退款
    function refund() onlyManager  public {
        // 遍历每一个参与者，执行转账操作
        for (uint256 i = 0; i < investors.length; i++) {
            investors[i].transfer(supportMoney);
        }
        // 清空数组
        delete investors;
    }

    // 记录所有的请求申请
    Request[] requests;

    // 发起请求申请
    function createRequest(string _purpose, uint256 _cost, address _seller) onlyManager public {
        Request memory req = Request({
            purpose : _purpose,
            cost : _cost * 10**18,
            seller : _seller,
            approveCount : 0,
            status : RequestStatus.Voting
        });
        requests.push(req);
    }

    // 批准请求
    // 参数i：第几个请求申请
    function approveRequest(uint256 i) public {
        Request storage req = requests[i];
        // 检查用户时候已经投票
        require(req.isVotedMap[msg.sender] == false);
        // 检查是否是投资人，只有投资人才有权投票
        require(isInvestorMap[msg.sender] == true);
        // 赞成票数加1
        req.approveCount++;
        // 记录该用户已经投票
        req.isVotedMap[msg.sender] = true;
    }

    // 完成花费申请
    function finalizeRequest(uint256 i) onlyManager  public {
        Request storage req = requests[i];
        // 检查余额是否足够
        require(address(this).balance >= req.cost);
        // 检查赞成票数是否过半
        require(req.approveCount * 2 > investors.length);
        // 转账给商家
        req.seller.transfer(req.cost);
        // 更新请求申请的状态为已完成
        req.status = RequestStatus.Completed;
    }

    modifier onlyManager {
        require(msg.sender == manager);
        _;
    }

    // 返回众筹剩余时间，以秒为单位
    function getLeftTime() public view returns(uint256) {
        return endTime - block.timestamp;
    }

    // 返回投资人的数量
    function getInvestorCount() public view returns(uint256) {
        return investors.length;
    }

    // 返回请求申请的数量
    function getRequestCount() public view returns(uint256) {
        return requests.length;
    }

    // 返回指定Request的信息
    function getRequest(uint256 i) public view returns(string, uint256, address, uint256, RequestStatus) {
        Request memory req = requests[i];
        return (req.purpose, req.cost, req.seller, req.approveCount, req.status);
    }

}
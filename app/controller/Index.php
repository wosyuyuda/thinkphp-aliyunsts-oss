<?php
namespace app\controller;

use app\BaseController;
use think\facade\Cache;
class Index extends BaseController
{

    protected $url = 'https://sts.aliyuncs.com';
    protected $accessKeySecret;
    protected $accessKeyId;
    protected $roleArn;//指定角色的 ARN ，角色策略权限
    protected $roleSessionName = 'client';//用户自定义参数。此参数用来区分不同的 token，可用于用户级别的访问审计。格式：^[a-zA-Z0-9\.@\-_]+$
    protected $durationSeconds = '1800';//指定的过期时间
    protected $us;

    public function __construct()
    {
        $this->accessKeySecret = "gb6G9sWS***********KWU3GNxi";
        $this->accessKeyId = "LTAI***********FYg";
        $this->roleArn = "acs:ram::***********:role/aliyunoss";
    }

    public function Getsts(){
        $ca=Cache::get('alikey'); 
        if($ca)return json($ca);
        require_once root_path().'vendor/aliyuncs/sts-server/aliyun-php-sdk-core/Config.php';
        $iClientProfile = \DefaultProfile::getProfile("cn-beijing", $this->accessKeyId, $this->accessKeySecret);
        $client = new \DefaultAcsClient($iClientProfile);
        $request = new \Sts\Request\V20150401\AssumeRoleRequest();
        $request->setRoleSessionName("client_name");
        $request->setRoleArn($this->roleArn);
//        $request->setPolicy(VENDOR_PATH.'aliyuncs/sts-server/policy/bucket_write_policy.txt');
        $request->setDurationSeconds($this->durationSeconds);
        $response = $client->doAction($request);
        $rows = array();
        $body = $response->getBody();
        $content = json_decode($body);
        if ($response->getStatus() == 200){
            $rows['statusCode'] = 200;
            $rows['accessKeyId'] = $content->Credentials->AccessKeyId;
            $rows['accessKeySecret'] = $content->Credentials->AccessKeySecret;
            $rows['expiration'] = $content->Credentials->Expiration;
            $rows['securityToken'] = $content->Credentials->SecurityToken;
        }else{
            $rows['statusCode'] = 500;
            $rows['errorCode'] = $content->Code;
            $rows['errorMessage'] = $content->Message;
        }
       // dump($content);
       Cache::set('alikey',$rows,900);
        return json($rows);
    }

    public function index()
    {
        return '<style type="text/css">*{ padding: 0; margin: 0; } div{ padding: 4px 48px;} a{color:#2E5CD5;cursor: pointer;text-decoration: none} a:hover{text-decoration:underline; } body{ background: #fff; font-family: "Century Gothic","Microsoft yahei"; color: #333;font-size:18px;} h1{ font-size: 100px; font-weight: normal; margin-bottom: 12px; } p{ line-height: 1.6em; font-size: 42px }</style><div style="padding: 24px 48px;"> <h1>:) </h1><p> ThinkPHP V' . \think\facade\App::version() . '<br/><span style="font-size:30px;">14载初心不改 - 你值得信赖的PHP框架</span></p><span style="font-size:25px;">[ V6.0 版本由 <a href="https://www.yisu.com/" target="yisu">亿速云</a> 独家赞助发布 ]</span></div><script type="text/javascript" src="https://tajs.qq.com/stats?sId=64890268" charset="UTF-8"></script><script type="text/javascript" src="https://e.topthink.com/Public/static/client.js"></script><think id="ee9b1aa918103c4fc"></think>';
    }

    public function hello($name = 'ThinkPHP6')
    {
        return 'hello,' . $name;
    }
}

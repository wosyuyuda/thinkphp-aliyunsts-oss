

accessid= '';
accesskey= '';
host = 'https://****.oss-cn-beijing.aliyuncs.com';
STS_ROLE = 'acs:ram::*****:role/aliyunoss'; // eg: acs:ram::1069test7698:role/all
STSToken=''
var signature
var bytes
        // serverUrl是 用户获取 '签名和Policy' 等信息的应用服务器的URL，请将下面的IP和Port配置为您自己的真实信息。
        serverUrl = '/aliyun/getsts'
		
        $.get(serverUrl,function(data,status){
			if(status=='success'){
				accessid=data.accessKeyId
				accesskey=data.accessKeySecret
				STSToken=data.securityToken
				console.log(data)
				bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, { asBytes: true }) ;
				signature = Crypto.util.bytesToBase64(bytes);
			}else{
				console.log('error')
			}
		});


g_dirname = ''
g_object_name = ''
g_object_name_type = ''
now = timestamp = Date.parse(new Date()) / 1000; 

var policyText = {
    "expiration": "2022-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
    "conditions": [
    ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
    ]
};

var policyBase64 = Base64.encode(JSON.stringify(policyText))
message = policyBase64



function get_dirname()
{
    dir = 'app';
    if (dir != '' && dir.indexOf('/') != dir.length - 1)
    {
        dir = dir + '/'
    }
    //alert(dir)
    g_dirname = dir
}

function random_string(len) {
　　len = len || 32;
　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
　　var maxPos = chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
    　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }

    return new Date().getTime()+pwd;
}

function get_suffix(filename) {
    pos = filename.lastIndexOf('.')
    suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

function calculate_object_name(filename)
{

        suffix = get_suffix(filename)
        g_object_name = g_dirname + random_string(3) + suffix

    return ''
}

function get_uploaded_object_name(filename)
{

        return g_object_name
 
}

function set_upload_param(up, filename, ret)
{
    g_object_name = g_dirname;
    if (filename != '') {
        suffix = get_suffix(filename)
        calculate_object_name(filename)
    }
    new_multipart_params = {
        'key' : g_object_name,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid, 
        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
        'signature': signature,
		'x-oss-security-token':STSToken,
    };

    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });

    up.start();
}

var uploader = new plupload.Uploader({
	runtimes : 'html5,flash,silverlight,html4',
	browse_button : 'selectfiles', 
    //multi_selection: false,
	container: document.getElementById('container'),
	flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
	silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
    url : 'https://oss.aliyuncs.com',
	filters : [ {
                title : 'Image files',
                extensions : 'jpg,gif,png'
            }
            /* , {
                title : 'Office files',
                extensions : 'doc,docx,excel,ppt,txt,mpp,xls,xlsx,pdf'
            } */
            ,
			{
                title : 'video files',
                extensions : 'mp4,avi,mov'
            } 

            ],
	init: {
		PostInit: function() {
			document.getElementById('ossfile').innerHTML = '';
			document.getElementById('postfiles').onclick = function() {
            set_upload_param(uploader, '', false);
            return false;
			};
		},

		FilesAdded: function(up, files) {
			plupload.each(files, function(file) {
				document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
				+'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
				+'</div>';
			});
			document.getElementById("postfiles").click();
		},

		BeforeUpload: function(up, file) {
            get_dirname();
            set_upload_param(up, file.name, true);
        },

		UploadProgress: function(up, file) {
			var d = document.getElementById(file.id);
			d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            var prog = d.getElementsByTagName('div')[0];
			var progBar = prog.getElementsByTagName('div')[0]
			progBar.style.width= 2*file.percent+'px';
			progBar.setAttribute('aria-valuenow', file.percent);
		},

		FileUploaded: function(up, file, info) {
            if (info.status == 200)
            {
				imgurl=host+'/'+ get_uploaded_object_name(file.name)
				addimg(imgurl);
               // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:<video  src="' +imgurl+'" controls="controls"/>';
				//<video :src="arcdata.vedio_url" controls="controls"> </video>
            }
            else
            {
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
            } 
		},

		Error: function(up, err) {
			document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
		}
	}
});

uploader.init();

import path from 'path'
import formdata from 'formidable'
import cp from 'child_process'
import fs from 'fs'
const __dirname = path.resolve();

export default defineEventHandler(async (event) => {
  const request = event.node.req


  const filePath = path.join(__dirname, './', 'uploads');
  var form = new formdata.IncomingForm();
  form.maxFileSize = 50 * 1024 * 1024;
  form.multiples = true
  form.uploadDir = filePath; //指定保存文件的路径，formidable会自动保存文件
  request.files = {};
  request.data = {};

  await form.parse(request);
  await form.on('file', function (name, file) {
    console.log('file');
    request.files[name] = file;//这里提取上传的文件
  });
  await form.on('end', async function () {
    console.log('end');
    // 默认保存的文件名是随机串
    for (var k in request.files) {
      var f = request.files[k];
      var n = 'origin_' + f.originalFilename;
      // 自己重新指定文件名和后缀
      if (f.mimetype.indexOf('image/') == 0) {
        await fs.renameSync(f.filepath, filePath + "/" + n);
        // 图片压缩
        await cp.execSync(`ffmpeg -i ${filePath}/origin_${f.originalFilename} -vf scale=-1:100 ${filePath}/after_${f.originalFilename}`)
      } else if (f.mimetype.indexOf('video/') == 0) {
        console.log(1111111111111)
        await fs.rename(f.filepath, filePath + "/" + n, async function(err){
          if(err) throw err;
          // 视频抽帧
          await cp.execSync(`ffmpeg -i ${filePath}/origin_${f.originalFilename} -ss 1 -vframes 1 ${filePath}/after_pic.png`)
        });

      }
    }
  });
  return {
    api: 'works'
  }
})
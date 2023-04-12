<template>
 <div>
    <input type="file" name="pickerPic" id="picId" @change="getFile($event)" accept="image/*, video/*">
  </div>   
</template>
  
<script setup lang='ts'>
  function getFile(e:any) {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append('file',file);
    $fetch('/api/hello', {method: 'POST', body: formData}).then(res => {
      console.log('res=>',res)
    })
  }
</script>
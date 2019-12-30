<script>
export default
{
  LIST:(_url,_params)=>{
      var that = this;
    axios.get(_url,_params)
        .then(function (response) {
        var data = response.data;
        console.log(that.list);
        //that.list = data.data;
        
        })
        .catch(function (error) {
        console.log(error);
        });
  }
}
</script>

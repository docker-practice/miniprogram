Page({
  data: {
    switch: true,
  },
  onLoad(){

  },
  onChange(e:any){
    console.log(e);
    this.setData!({
      switch: e.detail.value,
    });
  }
});

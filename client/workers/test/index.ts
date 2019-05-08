// @ts-ignore
worker.onMessage(res => {
  console.log(res);

  // @ts-ignore
  worker.postMessage({
    msg: 'work message',
  });
});

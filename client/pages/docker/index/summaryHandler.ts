export default function (summary: string) {
  const line = summary.split('\n');

  let newSummary = '';

  line.forEach((v) => {
    // console.log(v);
    if (v.match(/^#/) !== null || !v) {
      return;
    }

    let path;
    // let key;

    // try {
    //   key = v.split('](')[0].split('[')[1]
    // } catch (e) {
    //   return;
    // }

    try {
      path = v.split('(')[1].split(')')[0];
    } catch (e) {
      return;
    }

    let newPath = `../content/index?key=${path}`;
    v.replace(path, newPath);

    newSummary += v.replace(path, newPath) + '\n';
  });

  return newSummary;
}

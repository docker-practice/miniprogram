export default class Time {
  format(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return (
      [year, month, day].map(this.formatNumber).join('/') +
      ' ' +
      [hour, minute, second].map(this.formatNumber).join(':')
    );
  }

  public formatNumber = (n: number) => {
    const str = n.toString();
    return str[1] ? str : '0' + str;
  };
}

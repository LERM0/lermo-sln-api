import moment from 'moment';

const Diff = (date: Date) => {
  const dateCompare = moment(date, "YYYYMMDD").fromNow();
  return dateCompare
}

const msToTime = (duration: number) => {
  const milliseconds = (duration % 1000) / 100
  let seconds: any = Math.floor((duration / 1000) % 60)
  let minutes: any = Math.floor((duration / (1000 * 60)) % 60)
  let hours: any = Math.floor((duration / (1000 * 60 * 60)) % 24);

  if (hours) {
    return hours + "h" + " " + minutes + "m";
  } else if (minutes)  {
    return minutes + "m";
  } else {
    return seconds + "s";
  }
}

export { Diff, msToTime } 
const convertPlayDateFormat = (palyDate: string, language: string = 'zh') => {
  const date = new Date(palyDate)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  // const day = date.toISOString().substring(8, 10)
  const day = date.getDate().toString().padStart(2, '0')
  // const weekday = ["(日)", "(一)", "(二)", "(三)", "(四)", "(五)", "(六)"][date.getDay()]

  const weekdays: { [key: string]: { [key: number]: string } } = {
    'zh': {
      0: '(日)',
      1: '(一)',
      2: '(二)',
      3: '(三)',
      4: '(四)',
      5: '(五)',
      6: '(六)'
    },
    'en': {
      0: '(Sun)',
      1: '(Mon)',
      2: '(Tue)',
      3: '(Wed)',
      4: '(Thu)',
      5: '(Fri)',
      6: '(Sat)'
    }
  }
  const weekday = weekdays[language][date.getDay()]
  const dateFormatted = `${year}/${month}/${day} ${weekday}`
  // const timeFormatted = date.toISOString().substring(11, 16)
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return {
    year,
    date: dateFormatted,
    dateNoweekday: `${year}/${month}/${day}`,
    time: `${hours}:${minutes}`
  }
}

const convertTimeFormat = (lang: string, num: number) => {
  const hour_min: any = {
    'zh': {
      t_hour: '時',
      t_min: '分',
    },
    'en': {
      t_hour: 'h ',
      t_min: 'm',
    }
  }
  const hour = Math.floor(num / 60)
  const minute = num % 60
  const { t_hour, t_min } = hour_min[lang]
  return `${hour}${t_hour}${minute.toString().padStart(2, '0')}${t_min}`
}

const converDateFormat = (dateString: string) => {
  if (dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate
  } else {
    return ''
  }

}

export { convertPlayDateFormat, convertTimeFormat, converDateFormat }
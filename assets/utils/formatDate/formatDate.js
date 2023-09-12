const formatDate = ( date ) => {
  let dateObj = new Date(date)
  const content = dateObj.toLocaleDateString("fr", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  return content
}

export default formatDate

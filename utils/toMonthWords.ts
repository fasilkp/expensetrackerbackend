export default function toMonthWords(month): string{
    var months=[
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "dec"
    ]
    var date=new Date()
    return months[month]
}
export function generateReference(name:string){
    const dayOfWeekName = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    const dayOfWeek = dayOfWeekName[today.getDay()];
    const dayOfMonth = today.getDate();
    const month = monthName[today.getMonth()];
    const year = today.getFullYear();
    const hour = today.getHours();
    const minute = today.getMinutes();
    const second = today.getSeconds();
    let reference = 'SAT@'+name+'@'+dayOfWeek+dayOfMonth+month+year+'T'+hour+minute+second;
    return reference;
}

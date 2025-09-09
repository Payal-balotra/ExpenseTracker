import dayjs from "dayjs";

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Add thousands separator to a number
export const addThousandsSeprator = (num) => {
  if (num == null || isNaN(num)) return "";
  
  const [integerPart, fractionalPart] = num.toString().split(".");
  
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};


export const prepareExpenseBarChartData = (data)=>{
  return  data.map((item)=>({
    category :item?.category,
    amount : item?.amount
  }))
}

export const prepareIncomeBarChartData =(data) =>{
 const sortedData =[...data].sort((a,b)=> new Date(a.date) - new Date(b.date));
return sortedData.map((item )=>({
  month : dayjs(item?.date).format("DD MMM"),
  amount : item?.amount,
  source: item?.source
 }

 ))
}



export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return sortedData.map((item) => ({
    month: dayjs(item?.date).format("DD MMM"),
    amount: Number(item?.amount) || 0,
    category: item?.category || "Expense",
  }));
};




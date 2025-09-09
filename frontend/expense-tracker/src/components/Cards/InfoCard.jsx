

const InfoCard = ({ 
  icon,
  label,
  value,
  color
}) => {
  
  return (
  <div className='flex items-center bg-white p-4 rounded-lg  '>
    <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
      {icon}
    </div>
    <div className='ml-4'>
      <h6 className='text-sm text-gray-500 mb-1'>{label}</h6>
      <span className='text-[22px]'>{value !== null && value !== undefined ? `$${value}` : "$0"}</span>
    </div>
  </div>
  );
};

export default InfoCard;

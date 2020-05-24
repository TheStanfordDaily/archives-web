import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../../../components/CalendarView'),
{ ssr: false });

export default DynamicComponent; 
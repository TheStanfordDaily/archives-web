import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/AllYearView'),
{ ssr: false });

export default DynamicComponent;
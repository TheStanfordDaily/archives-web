// can't server side render b/c it screws w/ the form responses when you refresh
import dynamic from 'next/dynamic';
const DynamicComponent = dynamic(() => import('../components/CorrectionsView'),
{ ssr: false });

export default DynamicComponent; 
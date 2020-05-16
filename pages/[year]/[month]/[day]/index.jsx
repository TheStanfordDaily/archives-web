import dynamic from 'next/dynamic';

const DynamicPaperViewNoSSR = dynamic(
  () => import("../../../../components/PaperView"),
  { ssr: false }
);

export default () => (<DynamicPaperViewNoSSR />);
import { TextShimmer } from '../motion-primitives/text-shimmer';

export function GenericLoading({ text }: { text?: string }) {
  return (
    <TextShimmer className='font-mono text-md' duration={1}>
      {text || 'Loading data...'}
    </TextShimmer>
  );
}

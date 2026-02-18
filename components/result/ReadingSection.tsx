type Props = {
  data: {
    headline: string;
    paragraph1: string;
    paragraph2: string;
    mixTitle: string;
  };
};

export default function ReadingSection({ data }: Props) {
  return (
    <section className="py-10 px-6 border-b border-white/10">
      <div className="w-full max-w-sm mx-auto">

        {/* Headline */}
        <p className="text-white font-semibold text-2xl leading-relaxed mb-3">
          {data.headline}
        </p>

        {/* Body 1 */}
        <p className="text-white/80 text-m leading-relaxed mb-8">
          {data.paragraph1}
        </p>

        {/* Mix Title */}
        <h3 className="text-white font-semibold text-2xl mb-3">
          {data.mixTitle}
        </h3>

        {/* Body 2 */}
        <p className="text-white/80 text-m leading-relaxed">
          {data.paragraph2}
        </p>
      </div>
    </section>
  );
}

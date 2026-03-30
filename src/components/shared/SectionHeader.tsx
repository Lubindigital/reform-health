import { FadeUp } from "@/components/motion/FadeUp";

interface SectionHeaderProps {
  tag: string;
  title: string;
  description?: string;
  light?: boolean;
}

export function SectionHeader({ tag, title, description, light = false }: SectionHeaderProps) {
  return (
    <FadeUp className="text-center max-w-[600px] mx-auto mb-16">
      <span className="tag">{tag}</span>
      <h2 className={`font-heading text-3xl md:text-4xl lg:text-[2.4rem] font-bold leading-tight tracking-tight mb-4 ${light ? "text-white" : "text-gray-900"}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-base leading-relaxed ${light ? "text-white/60" : "text-gray-500"}`}>
          {description}
        </p>
      )}
    </FadeUp>
  );
}

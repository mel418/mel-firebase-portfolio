import { getSkill, type SkillId } from '@/content';
import { Badge } from '@/components/ui/badge';

export function StackList({ stack, className }: { stack: SkillId[]; className?: string }) {
  return (
    <div className={className ?? 'flex flex-wrap gap-1.5'}>
      {stack.map((id) => {
        const skill = getSkill(id);
        return (
          <Badge key={id} variant="outline" className="border-primary/30 text-xs text-accent-ink">
            {skill?.name ?? id}
          </Badge>
        );
      })}
    </div>
  );
}

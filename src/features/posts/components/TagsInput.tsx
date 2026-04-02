import { useState, useRef, KeyboardEvent } from "react";
import { useTagSuggestions } from "../hooks/useTagSuggestions";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { X } from "lucide-react";

export function TagsInput({
  value,
  onChange,
  maxTags = 4,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { suggestions, isLoading } = useTagSuggestions(input);

  const canAddMore = value.length < maxTags;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() && canAddMore) {
      e.preventDefault();
      addTag(input.trim());
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const addTag = (tag: string) => {
    const normalized = tag.toLowerCase().replace(/\s+/g, "-");
    if (!value.includes(normalized) && canAddMore) {
      onChange([...value, normalized]);
      setInput("");
      setShowSuggestions(false);
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        {canAddMore && (
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={
              value.length === 0 ? "Add up to 4 tags..." : "Add another tag..."
            }
            className="w-40 border-0 focus-visible:ring-0 p-0 h-auto"
          />
        )}
      </div>

      {showSuggestions && input && suggestions.length > 0 && (
        <div className="absolute z-10 bg-popover border rounded-md shadow-md p-2 max-h-40 overflow-auto">
          {suggestions.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => addTag(tag.name)}
              className="block w-full text-left px-2 py-1 hover:bg-accent rounded"
            >
              #{tag.name}
            </button>
          ))}
        </div>
      )}

      {value.length >= maxTags && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxTags} tags allowed
        </p>
      )}
    </div>
  );
}
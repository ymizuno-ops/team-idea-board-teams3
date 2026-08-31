import type { Category, CategoryFilterValue } from "@/types/idea";

type CategoryFilterProps = {
  categories: readonly Category[];
  activeCategory: CategoryFilterValue;
  onChange: (category: CategoryFilterValue) => void;
};

const ALL_VALUE: CategoryFilterValue = "すべて";

export function CategoryFilter({
  categories,
  activeCategory,
  onChange,
}: CategoryFilterProps) {
  const options: CategoryFilterValue[] = [ALL_VALUE, ...categories];

  return (
    <div className="category-filter" role="group" aria-label="カテゴリで絞り込む">
      {options.map((option) => {
        const isActive = option === activeCategory;
        return (
          <button
            key={option}
            type="button"
            className={`filter-chip${isActive ? " filter-chip-active" : ""}`}
            aria-pressed={isActive}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

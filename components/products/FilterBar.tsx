"use client";

interface FilterBarProps {
  category: string;
  sortBy: string;
  order: "asc" | "desc";
  categories: string[];
  onCategoryChange: (category: string) => void;
  onSortByChange: (sortBy: string) => void;
  onOrderChange: (order: "asc" | "desc") => void;
}

export default function FilterBar({
  category,
  sortBy,
  order,
  categories,
  onCategoryChange,
  onSortByChange,
  onOrderChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm md:flex-row md:items-center">
      <select
        value={category}
        onChange={(event) =>
          onCategoryChange(event.target.value)
        }
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
      >
        <option value="">All Categories</option>

        {categories.map((item) => (
          <option key={item} value={item}>
            {item
              .split("-")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() +
                  word.slice(1)
              )
              .join(" ")}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(event) =>
          onSortByChange(event.target.value)
        }
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
      >
        <option value="">Sort By</option>
        <option value="title">Title</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
      </select>

      <select
        value={order}
        onChange={(event) =>
          onOrderChange(
            event.target.value as "asc" | "desc"
          )
        }
        disabled={!sortBy}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}
"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";

const ratingLabels = [
  "",
  "Needs work",
  "Could be better",
  "Decent",
  "Great session!",
  "Outstanding!",
];

const ratingColors = [
  "",
  "text-red-400",
  "text-orange-400",
  "text-amber-400",
  "text-yellow-400",
  "text-emerald-400",
];

const StarRating = ({ changeRating }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleRating = (n) => {
    setRating(n);
    changeRating(n);
  };

  const active = hover || rating;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-1.5">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleRating(num)}
            onMouseEnter={() => setHover(num)}
            onMouseLeave={() => setHover(0)}
            className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
              num <= active
                ? `${ratingColors[active]} scale-105`
                : "text-muted-foreground/30 hover:text-muted-foreground/50"
            }`}
          >
            <Star
              className="w-8 h-8 sm:w-9 sm:h-9"
              fill={num <= active ? "currentColor" : "none"}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      {active > 0 && (
        <p className={`text-center text-sm font-medium ${ratingColors[active]} transition-colors`}>
          {ratingLabels[active]}
        </p>
      )}
    </div>
  );
};

export default StarRating;

export const generateRatingStarsSnippet = (): string => {
  return `{%- comment -%}
  Dropwiz Rating Stars Snippet
  Usage: {% render 'dw-rating-stars', rating: 4.5 %}
{%- endcomment -%}

{%- assign full_stars = rating | floor -%}
{%- assign has_half = rating | modulo: 1 | at_least: 0.5 -%}

<span class="dw-stars">
  {%- for i in (1..5) -%}
    {%- if i <= full_stars -%}
      ★
    {%- elsif i == full_stars | plus: 1 and has_half -%}
      <span class="dw-stars-half">★</span>
    {%- else -%}
      <span class="dw-stars-faded">★</span>
    {%- endif -%}
  {%- endfor -%}
</span>`;
};

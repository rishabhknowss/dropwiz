export const generateHeroProductSnippet = (): string => {
  return `{%- comment -%}
  Dropwiz Hero Product Snippet (Product-Hero variant)
  Usage: {% render 'dw-hero-product', section: section %}
{%- endcomment -%}

<section class="dw-hero-product">
  {% if section.settings.show_header %}
    <header class="dw-ph-header">
      <span class="dw-ph-brand">{{ shop.name }}</span>
      <a href="{% if section.settings.button_link != blank %}{{ section.settings.button_link }}{% elsif product %}#dw-product{% else %}{{ routes.all_products_collection_url }}{% endif %}" class="dw-ph-header-btn">{{ section.settings.button_text | default: 'Shop Now' }}</a>
    </header>
  {% endif %}

  <div class="dw-ph-grid">
    <div class="dw-ph-left">
      <div class="dw-ph-img-wrap">
        {% if section.blocks.size > 0 %}
          <div class="dw-ph-side-cards">
            {% for block in section.blocks %}
              {% if block.type == 'side_feature' %}
                <div class="dw-ph-side-card" {{ block.shopify_attributes }}>
                  {% if block.settings.icon != blank %}
                    <span class="dw-ph-side-icon">{% render 'dw-icon', icon: block.settings.icon %}</span>
                  {% endif %}
                  <span class="dw-ph-side-label">{{ block.settings.label }}</span>
                </div>
              {% endif %}
            {% endfor %}
          </div>
        {% endif %}

        <div class="dw-ph-main-img">
          {% if section.settings.image != blank %}
            {{ section.settings.image | image_url: width: 800 | image_tag }}
          {% elsif product.featured_image %}
            {{ product.featured_image | image_url: width: 800 | image_tag }}
          {% else %}
            <div class="dw-gradient"></div>
          {% endif %}
        </div>
      </div>

      {% if product.images.size > 1 %}
        <div class="dw-ph-thumbs">
          {% for image in product.images limit: 4 %}
            <div class="dw-ph-thumb" data-image="{{ image | image_url: width: 800 }}">
              {{ image | image_url: width: 150 | image_tag }}
            </div>
          {% endfor %}
        </div>
      {% endif %}

      {% if section.blocks.size > 0 %}
        <div class="dw-ph-side-cards-mobile">
          {% for block in section.blocks %}
            {% if block.type == 'side_feature' %}
              <div class="dw-ph-side-card" {{ block.shopify_attributes }}>
                {% if block.settings.icon != blank %}
                  <span class="dw-ph-side-icon">{% render 'dw-icon', icon: block.settings.icon %}</span>
                {% endif %}
                <span class="dw-ph-side-label">{{ block.settings.label }}</span>
              </div>
            {% endif %}
          {% endfor %}
        </div>
      {% endif %}
    </div>

    <div class="dw-ph-right">
      {% if section.settings.show_rating and section.settings.review_count > 0 %}
        <div class="dw-ph-rating">
          <span class="dw-ph-rating-bar">★★★★★</span>
          <span class="dw-ph-rating-text">{{ section.settings.rating }}/5 stars by {{ section.settings.review_count }}+ customers</span>
        </div>
      {% endif %}

      <h1 class="dw-ph-headline">{{ section.settings.headline | default: product.title }}</h1>

      {% if section.settings.subheadline != blank %}
        <p class="dw-ph-subheadline">{{ section.settings.subheadline }}</p>
      {% endif %}

      <div class="dw-ph-price">
        <span class="dw-ph-price-current">{% if product %}{{ product.price | money }}{% else %}$0.00{% endif %}</span>
        {% if product.compare_at_price > product.price %}
          <span class="dw-ph-price-old">{{ product.compare_at_price | money }}</span>
        {% endif %}
      </div>

      {% if product %}
        {%- form 'product', product, class: 'dw-ph-form' -%}
          <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" />
          <button type="submit" class="dw-ph-cta">{{ section.settings.button_text | default: 'ADD TO CART' }}</button>
        {%- endform -%}
      {% else %}
        <a href="{{ routes.all_products_collection_url }}" class="dw-ph-cta">{{ section.settings.button_text | default: 'SHOP NOW' }}</a>
      {% endif %}

      {% if section.settings.show_payment_badges %}
        <div class="dw-payment-badges">
          {% render 'dw-payment-icons' %}
        </div>
      {% endif %}
    </div>
  </div>
</section>

<script>
(function() {
  document.querySelectorAll('.dw-ph-thumb').forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      var container = this.closest('.dw-hero-product');
      if (!container) return;
      var img = this.querySelector('img');
      if (!img) return;
      var src = this.dataset.image || img.src;
      var mainImg = container.querySelector('.dw-ph-main-img img');
      if (mainImg && src) {
        mainImg.src = src;
      }
    });
  });
})();
</script>`;
};

"use strict";

/**
 * Runtime + operator schema for content/config/platform.json.
 * Keep this the one definition of required brand/homepage/nav/futurePath/about fields.
 */

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function collectPlatformConfigErrors(raw, vis) {
  const errors = [];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    errors.push("platform.json must be a JSON object");
    return errors;
  }

  const brand = raw.brand;
  if (!brand || typeof brand !== "object") {
    errors.push('platform.json "brand" section is required');
  } else {
    if (!isNonEmptyString(brand.name) || !isNonEmptyString(brand.logo)) {
      errors.push("brand requires name and logo");
    }
    if (!isNonEmptyString(brand.logoAlt) || !isNonEmptyString(brand.logoMark) || !isNonEmptyString(brand.ogImage)) {
      errors.push("brand requires logoAlt, logoMark, and ogImage");
    }
    if (!isNonEmptyString(brand.url) || !/^https:\/\//.test(brand.url)) {
      errors.push("brand.url must be an https origin such as https://theairishi.com");
    }
    if (!isNonEmptyString(brand.description)) {
      errors.push("brand.description is required (platform description, not a slogan and not the program outcome)");
    }
    if (Object.prototype.hasOwnProperty.call(brand, "lineage")) {
      errors.push(
        "ERROR:\nplatform.json brand.lineage must not exist.\n\nFix:\nDelete brand.lineage. The brand stands on its own."
      );
    }
    if (brand.tagline != null) {
      if (typeof brand.tagline !== "string") {
        errors.push("brand.tagline, when present, must be a string.");
      } else if (!brand.tagline.trim()) {
        errors.push(
          "brand.tagline is empty. Omit the field from platform.json instead of leaving a blank slogan."
        );
      }
    }
  }

  const copy = raw.copy;
  if (!copy || typeof copy !== "object") {
    errors.push("platform.json missing copy");
  } else {
    for (const field of [
      "heroDescription",
      "heroPrimaryCta",
      "heroPrimaryCtaHref",
      "heroSecondaryCta",
      "heroSecondaryCtaHref",
      "headerCta",
      "headerCtaHref",
    ]) {
      if (!isNonEmptyString(copy[field])) {
        errors.push("copy." + field + " is required");
      }
    }
    if (copy.heroTitle != null && !isNonEmptyString(copy.heroTitle)) {
      errors.push(
        "copy.heroTitle is empty. Omit the field; the hero uses the current program title."
      );
    }
    if (copy.heroTagline != null && !isNonEmptyString(copy.heroTagline)) {
      errors.push(
        "copy.heroTagline is empty. Omit the field instead of leaving a blank slogan."
      );
    }
  }

  if (!raw.defaults || typeof raw.defaults !== "object") {
    errors.push("platform.json missing defaults");
  } else {
    if (!isNonEmptyString(raw.defaults.authorName)) {
      errors.push(
        "defaults.authorName is required. It is the public Person name in structured data — an explicit operator choice, not inferred."
      );
    }
    if (raw.defaults.sameAs != null) {
      if (!Array.isArray(raw.defaults.sameAs) || raw.defaults.sameAs.some((item) => typeof item !== "string" || !/^https:\/\//.test(item))) {
        errors.push("defaults.sameAs must be an array of https URLs when set");
      }
    }
    if (raw.defaults.authorUrl != null && (typeof raw.defaults.authorUrl !== "string" || !/^https:\/\//.test(raw.defaults.authorUrl))) {
      errors.push("defaults.authorUrl must be an https URL when set");
    }
  }

  const sectionTypes = (vis && vis.SECTION_TYPES) || [];
  const homepage = raw.homepage;
  if (!homepage || !Array.isArray(homepage.sections)) {
    errors.push("homepage.sections required");
  } else {
    const sectionIds = new Set();
    for (const section of homepage.sections) {
      if (!section || !isNonEmptyString(section.id)) {
        errors.push("Homepage section missing id");
        continue;
      }
      if (sectionIds.has(section.id)) {
        errors.push("Duplicate homepage section id: " + section.id);
      }
      sectionIds.add(section.id);
      if (!isNonEmptyString(section.type) || !sectionTypes.includes(section.type)) {
        errors.push(
          "Homepage section '" +
            section.id +
            "' has unknown type: " +
            (section.type || "(empty)") +
            ". Allowed: " +
            sectionTypes.join(", ")
        );
      }
    }
  }

  const nav = raw.navigation;
  if (!nav || !Array.isArray(nav.main) || !Array.isArray(nav.footer)) {
    errors.push("navigation.main and navigation.footer must be arrays");
  } else {
    for (const listName of ["main", "footer"]) {
      const ids = new Set();
      for (const item of nav[listName]) {
        if (!item || !isNonEmptyString(item.id)) {
          errors.push("navigation." + listName + " item missing id");
          continue;
        }
        if (ids.has(item.id)) {
          errors.push("duplicate navigation id '" + item.id + "' in navigation." + listName);
        }
        ids.add(item.id);
        if (item.enabled === false) continue;
        if (!isNonEmptyString(item.label) || !isNonEmptyString(item.href)) {
          errors.push("navigation." + listName + " item '" + item.id + "' needs label and href");
        }
      }
    }
  }

  const futurePath = raw.futurePath;
  if (futurePath != null) {
    if (!Array.isArray(futurePath)) {
      errors.push("futurePath must be an array");
    } else {
      const ids = new Set();
      for (const item of futurePath) {
        if (!item || !isNonEmptyString(item.id) || !isNonEmptyString(item.label)) {
          errors.push("futurePath item missing id or label");
          continue;
        }
        if (ids.has(item.id)) errors.push("Duplicate futurePath id: " + item.id);
        ids.add(item.id);
        const status = vis && vis.normalizeStatus ? vis.normalizeStatus(item.status) : item.status;
        if (vis && vis.isValidLifecycle && !vis.isValidLifecycle(item.status || "active")) {
          errors.push("futurePath '" + item.id + "' has invalid status: " + item.status);
        }
        if (status === "active" && !isNonEmptyString(item.href)) {
          errors.push("futurePath '" + item.id + "' is active and must have href");
        }
      }
    }
  }

  const about = raw.about;
  if (about != null) {
    if (typeof about !== "object" || Array.isArray(about)) {
      errors.push("about must be an object");
    } else {
      if (!isNonEmptyString(about.title) || !isNonEmptyString(about.intro)) {
        errors.push("about requires title and intro");
      }
      if (!Array.isArray(about.sections) || about.sections.length === 0) {
        errors.push("about.sections must be a non-empty array");
      } else {
        const ids = new Set();
        for (const section of about.sections) {
          if (!section || !isNonEmptyString(section.id) || !isNonEmptyString(section.title) || !isNonEmptyString(section.body)) {
            errors.push("about.sections items require id, title, and body");
            continue;
          }
          if (ids.has(section.id)) errors.push("Duplicate about section id: " + section.id);
          ids.add(section.id);
        }
      }
    }
  }

  const story = raw.story;
  if (story && Array.isArray(story.methodSteps)) {
    for (const step of story.methodSteps) {
      if (!step || !isNonEmptyString(step.n) || !isNonEmptyString(step.title) || !isNonEmptyString(step.body)) {
        errors.push("story.methodSteps items require n, title, and body");
        break;
      }
    }
  }

  const topics = raw.topics;
  if (!Array.isArray(topics)) {
    errors.push("topics must be an array");
  } else {
    const ids = new Set();
    const slugs = new Set();
    for (const topic of topics) {
      if (!topic || !isNonEmptyString(topic.id) || !isNonEmptyString(topic.slug) || !isNonEmptyString(topic.name)) {
        errors.push("Topic missing required fields (id, slug, name)");
        continue;
      }
      if (ids.has(topic.id)) errors.push("Duplicate topic id: " + topic.id);
      if (slugs.has(topic.slug)) errors.push("Duplicate topic slug: " + topic.slug);
      ids.add(topic.id);
      slugs.add(topic.slug);
      if (topic.status && vis && vis.isValidLifecycle && !vis.isValidLifecycle(topic.status)) {
        errors.push('Topic "' + topic.id + '" has invalid status: "' + topic.status + '"');
      }
      if (topic.includeInSearch != null && typeof topic.includeInSearch !== "boolean") {
        errors.push("Topic " + topic.id + " includeInSearch must be a boolean");
      }
      if (topic.includeInSitemap != null && typeof topic.includeInSitemap !== "boolean") {
        errors.push("Topic " + topic.id + " includeInSitemap must be a boolean");
      }
    }
  }

  return errors;
}

module.exports = {
  collectPlatformConfigErrors,
};

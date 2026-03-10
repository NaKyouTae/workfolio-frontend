import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://workfolio.kr";

    return [
        {
            url: `${baseUrl}/info`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/templates/preview/basic`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/service-guides`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/service-guides/company`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/service-guides/notices`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/service-guides/privacy-policies`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/service-guides/terms-services`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/service-guides/guides`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
    ];
}

"use client";

export function GotaLogo({
size = 72,
mono = false,
}: {
size?: number;
mono?: boolean;
}) {
return (
<img
src="/gota-logo.jpeg"
alt="GOTA International Group"
width={size}
height={size * 0.78}
style={{
objectFit: "contain",
display: "block",
background: mono ? "transparent" : "#000",
}}
/>
);
}

export function GotaWordmark({ height = 28 }: { height?: number }) {
return (
<img
src="/gota-logo.jpeg"
alt="GOTA Voyages — GOTA International Group"
style={{
height,
width: "auto",
objectFit: "contain",
display: "block",
}}
/>
);
}

export const COMPANY_PHONE = "+229 01 96 87 05 29";
export const COMPANY_EMAIL = "[tourisme@gotainternational.com](mailto:tourisme@gotainternational.com)";
export const BRAND_GOLD = "#C9A86A";
export const BRAND_ORANGE = "#EE8A1D";

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Image, Building2, Info, Trash2, Plus, BarChart3, Layers, MessageSquare, LayoutGrid } from "lucide-react";
import { ImageUpload } from "../components/ImageUpload";

const defaults = {
  hero: { slides: [{ imageEn: "", imageZh: "", imageEs: "" }], title: "", titleZh: "", titleEs: "", subtitle: "", subtitleZh: "", subtitleEs: "", tagline: "", taglineZh: "", taglineEs: "", stats: [{ value: 0, suffix: "", label: "", labelZh: "", labelEs: "" }] },
  trustBar: { items: [{ value: "", label: "", labelZh: "", labelEs: "" }] },
  featureCards: { sectionTitle: "", sectionTitleZh: "", sectionTitleEs: "", cards: [{ href: "", title: "", titleZh: "", titleEs: "", desc: "", descZh: "", descEs: "", linkText: "", linkTextZh: "", linkTextEs: "" }] },
  bestsellers: { topPicksLabel: "", topPicksLabelZh: "", topPicksLabelEs: "", title: "", titleZh: "", titleEs: "", subtitle: "", subtitleZh: "", subtitleEs: "" },
  reviews: { label: "", labelZh: "", labelEs: "", title: "", titleZh: "", titleEs: "", subtitle: "", subtitleZh: "", subtitleEs: "" },
  brand: { name: "", phone: "", email: "", addressEn: "", addressZh: "" },
  about: { titleEn: "", titleZh: "", titleEs: "", introEn: "", introZh: "", introEs: "" },
};

const tabs = [
  { key: "hero", label: "Hero", Icon: Image },
  { key: "trustBar", label: "信任栏", Icon: BarChart3 },
  { key: "featureCards", label: "卡片", Icon: Layers },
  { key: "bestsellers", label: "热销榜", Icon: LayoutGrid },
  { key: "reviews", label: "客户评价", Icon: MessageSquare },
  { key: "brand", label: "品牌信息", Icon: Building2 },
  { key: "about", label: "关于我们", Icon: Info },
] as const;

export default function SiteEditorPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("hero");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(defaults);

  useEffect(() => {
    fetch("/api/admin/site-content")
      .then((r) => r.json())
      .then((d) => { if (d.hero) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setNested = (obj: any, path: string, value: any) => {
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (/^\d+$/.test(k)) current = current[parseInt(k)];
      else current = current[k];
    }
    const last = keys[keys.length - 1];
    if (/^\d+$/.test(last)) current[parseInt(last)] = value;
    else current[last] = value;
  };

  const update = (path: string, value: unknown) => {
    setData((prev: Record<string, unknown>) => {
      const next = structuredClone(prev);
      setNested(next, path, value);
      return next;
    });
  };

  const getValue = (path: string): string => {
    const keys = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = data;
    for (const k of keys) {
      if (!val) return "";
      if (/^\d+$/.test(k)) val = val[parseInt(k)];
      else val = val[k];
    }
    return typeof val === "string" || typeof val === "number" ? String(val) : "";
  };

  const handleSubmit = async () => {
    setSaving(true);
    await fetch("/api/admin/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    alert("已保存！刷新首页查看效果");
  };

  const Input = ({ label, path, rows }: { label: string; path: string; rows?: number }) => (
    <div>
      <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">{label}</label>
      {rows ? (
        <textarea value={getValue(path)} onChange={(e) => update(path, e.target.value)} rows={rows} className="w-full px-3 py-2.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] transition-colors resize-y" />
      ) : (
        <input type="text" value={getValue(path)} onChange={(e) => update(path, e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] transition-colors" />
      )}
    </div>
  );

  // Helper for 3-language fields
  const LangFields = ({ basePath, label }: { basePath: string; label: string }) => (
    <div className="grid grid-cols-3 gap-2">
      <Input label={`${label} (EN)`} path={`${basePath}`} />
      <Input label={`${label} (中文)`} path={`${basePath}Zh`} />
      <Input label={`${label} (ES)`} path={`${basePath}Es`} />
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#B8A080] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => router.push("/admin")} className="p-2 rounded-lg hover:bg-white dark:hover:bg-white/5 text-[#6B6058] dark:text-white/40 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-[#3D3730] dark:text-[#D4C8B8]">站点编辑 Content</h1>
        </div>
        <button onClick={handleSubmit} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B8A080] text-white font-semibold text-sm hover:bg-[#A89070] transition-colors disabled:opacity-50">
          <Save className="w-4 h-4" />
          {saving ? "保存中..." : "Save All"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 p-1 flex-wrap">
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
              activeTab === key ? "bg-[#B8A080] text-white" : "text-[#9B8E7E] dark:text-white/40 hover:text-[#3D3730] dark:hover:text-white"
            }`}
          >
            <Icon className="w-3 h-3" />{label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* HERO */}
        {activeTab === "hero" && (
          <>
            <Section title="首页轮播图">
              <div className="flex justify-end mb-4">
                <button onClick={() => update("hero.slides", [...data.hero.slides, { imageEn: "", imageZh: "", imageEs: "" }])} className="inline-flex items-center gap-1 text-xs text-[#B8A080] hover:text-[#A89070] transition-colors">
                  <Plus className="w-3 h-3" />添加轮播图
                </button>
              </div>
              <div className="space-y-6">
                {data.hero.slides.map((s: { imageEn?: string; imageZh?: string; imageEs?: string; image?: string }, i: number) => (
                  <div key={i} className="relative group p-4 rounded-xl border border-[#E8E2DC] dark:border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-[#3D3730] dark:text-[#D4C8B8]">轮播图 {i + 1}</p>
                      {data.hero.slides.length > 1 && (
                        <button onClick={() => update("hero.slides", data.hero.slides.filter((_: unknown, j: number) => j !== i))} className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-[10px] text-[#9B8E7E] dark:text-white/30 mb-1">🇨🇳 中文图</p>
                        <ImageUpload value={s.imageZh || s.image || ""} onChange={(url: string) => update(`hero.slides.${i}.imageZh`, url)} />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#9B8E7E] dark:text-white/30 mb-1">🇺🇸 English</p>
                        <ImageUpload value={s.imageEn || s.image || ""} onChange={(url: string) => update(`hero.slides.${i}.imageEn`, url)} />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#9B8E7E] dark:text-white/30 mb-1">🇪🇸 Español</p>
                        <ImageUpload value={s.imageEs || s.image || ""} onChange={(url: string) => update(`hero.slides.${i}.imageEs`, url)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="轮播文案"><LangFields basePath="hero.tagline" label="标语" /><LangFields basePath="hero.title" label="标题" /><LangFields basePath="hero.subtitle" label="副标题" /></Section>
            <Section title="数据展示（3项）">
              <div className="grid grid-cols-3 gap-4">
                {data.hero.stats.map((stat: { value: number; suffix: string; label: string; labelZh: string; labelEs: string }, i: number) => (
                  <div key={i} className="p-3 rounded-lg border border-[#E8E2DC] dark:border-white/10 space-y-2">
                    <div className="flex gap-2">
                      <Input label="数值" path={`hero.stats.${i}.value`} />
                      <Input label="后缀" path={`hero.stats.${i}.suffix`} />
                    </div>
                    <Input label="标签 EN" path={`hero.stats.${i}.label`} />
                    <Input label="标签 ZH" path={`hero.stats.${i}.labelZh`} />
                    <Input label="标签 ES" path={`hero.stats.${i}.labelEs`} />
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* TRUST BAR */}
        {activeTab === "trustBar" && (
          <Section title="Trust Bar Stats (4 items)">
            <div className="grid grid-cols-2 gap-4">
              {data.trustBar.items.map((item: { value: string; label: string; labelZh: string; labelEs: string }, i: number) => (
                <div key={i} className="p-3 rounded-lg border border-[#E8E2DC] dark:border-white/10 space-y-2">
                  <Input label="数值" path={`trustBar.items.${i}.value`} />
                  <Input label="标签 EN" path={`trustBar.items.${i}.label`} />
                  <Input label="标签 ZH" path={`trustBar.items.${i}.labelZh`} />
                  <Input label="标签 ES" path={`trustBar.items.${i}.labelEs`} />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* FEATURE CARDS */}
        {activeTab === "featureCards" && (
          <>
            <Section title="Section 标题"><LangFields basePath="featureCards.sectionTitle" label="标题" /></Section>
            <Section title="卡片 (3 items)">
              {data.featureCards.cards.map((card: { href: string; title: string; titleZh: string; titleEs: string; desc: string; descZh: string; descEs: string; linkText: string; linkTextZh: string; linkTextEs: string }, i: number) => (
                <div key={i} className="mb-4 p-4 rounded-lg border border-[#E8E2DC] dark:border-white/10 space-y-2">
                  <h4 className="text-xs font-semibold text-[#B8A080]">Card {i + 1}</h4>
                  <Input label="Link (href)" path={`featureCards.cards.${i}.href`} />
                  <div className="grid grid-cols-3 gap-2">
                    <Input label="标题 EN" path={`featureCards.cards.${i}.title`} />
                    <Input label="标题 ZH" path={`featureCards.cards.${i}.titleZh`} />
                    <Input label="标题 ES" path={`featureCards.cards.${i}.titleEs`} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Input label="Desc EN" path={`featureCards.cards.${i}.desc`} />
                    <Input label="Desc ZH" path={`featureCards.cards.${i}.descZh`} />
                    <Input label="Desc ES" path={`featureCards.cards.${i}.descEs`} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Input label="Link Text EN" path={`featureCards.cards.${i}.linkText`} />
                    <Input label="Link Text ZH" path={`featureCards.cards.${i}.linkTextZh`} />
                    <Input label="Link Text ES" path={`featureCards.cards.${i}.linkTextEs`} />
                  </div>
                </div>
              ))}
            </Section>
          </>
        )}

        {/* BEST SELLERS */}
        {activeTab === "bestsellers" && (
          <Section title="Best Sellers Section">
            <LangFields basePath="bestsellers.topPicksLabel" label="Top 标签" />
            <LangFields basePath="bestsellers.title" label="标题" />
            <LangFields basePath="bestsellers.subtitle" label="副标题" />
          </Section>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <Section title="客户评价 Section">
            <LangFields basePath="reviews.label" label="Top 标签" />
            <LangFields basePath="reviews.title" label="标题" />
            <LangFields basePath="reviews.subtitle" label="副标题" />
            <p className="text-[10px] text-[#9B8E7E] dark:text-white/30 mt-2">
              客户评价 data is managed in data/reviews.ts. Contact developer to add/edit individual reviews.
            </p>
          </Section>
        )}

        {/* BRAND */}
        {activeTab === "brand" && (
          <Section title="品牌信息 & Contact">
            <Input label="品牌信息 名称" path="brand.name" />
            <div className="grid grid-cols-2 gap-3"><Input label="Phone" path="brand.phone" /><Input label="Email" path="brand.email" /></div>
            <Input label="Address EN" path="brand.addressEn" />
            <Input label="Address ZH" path="brand.addressZh" />
          </Section>
        )}

        {/* ABOUT */}
        {activeTab === "about" && (
          <Section title="关于我们 Page">
            <LangFields basePath="about.titleEn" label="标题" />
            <Input label="Intro EN" path="about.introEn" rows={4} />
            <Input label="Intro ZH" path="about.introZh" rows={4} />
            <Input label="Intro ES" path="about.introEs" rows={4} />
          </Section>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={handleSubmit} disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#B8A080] text-white font-semibold text-sm hover:bg-[#A89070] transition-colors disabled:opacity-50">
          <Save className="w-4 h-4" />
          {saving ? "保存中..." : "Save All"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 p-6">
      <h3 className="text-sm font-semibold text-[#3D3730] dark:text-[#D4C8B8] mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

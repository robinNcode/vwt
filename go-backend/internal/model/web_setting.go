package model

type WebSettings struct {
	// ── Site Identity ─────────────────────────────────────────
	SiteName        string      `json:"site_name"`
	SiteTagline     string      `json:"site_tagline"`
	SiteDescription string      `json:"site_description"`
	LogoURL         string      `json:"logo_url"`
	FaviconURL      string      `json:"favicon_url"`
	FooterText      string      `json:"footer_text"`
	SocialLinks     SocialLinks `json:"social_links"`

	// ── Contact Info ──────────────────────────────────────────
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Phone2  string `json:"phone2"`
	Address string `json:"address"`
	MapURL  string `json:"map_url"`

	// ── SEO Configuration ─────────────────────────────────────
	MetaTitle       string `json:"meta_title"`
	MetaDescription string `json:"meta_description"`
	MetaKeywords    string `json:"meta_keywords"`
	OGImage         string `json:"og_image"`
	GoogleAnalytics string `json:"google_analytics"`
	CanonicalURL    string `json:"canonical_url"`

	// ── Invoice / Quotation Branding ─────────────────────────
	CompanyName       string `json:"company_name"`
	CompanySubtitle   string `json:"company_subtitle"`
	CompanyLogoURL    string `json:"company_logo_url"`
	SignatureImageURL string `json:"signature_image_url"`
	ProprietorName    string `json:"proprietor_name"`
	ProprietorTitle   string `json:"proprietor_title"`
	BusinessAddress   string `json:"business_address"`
	BusinessEmail     string `json:"business_email"`
	BusinessPhone     string `json:"business_phone"`
	BusinessPhone2    string `json:"business_phone2"`
	BankName          string `json:"bank_name"`
	BankAccountName   string `json:"bank_account_name"`
	BankAccountNumber string `json:"bank_account_number"`
	BankRoutingNumber string `json:"bank_routing_number"`
	InvoiceFooterNote string `json:"invoice_footer_note"`

	// ── Email (SMTP) ──────────────────────────────────────────
	SMTPHost       string `json:"smtp_host"`
	SMTPPort       string `json:"smtp_port"`
	SMTPUser       string `json:"smtp_user"`
	SMTPPassword   string `json:"smtp_password"`
	SMTPFromName   string `json:"smtp_from_name"`
	SMTPFromEmail  string `json:"smtp_from_email"`
	SMTPEncryption string `json:"smtp_encryption"`

	// ── Admin Panel Theme ─────────────────────────────────────
	ThemePrimaryColor string `json:"theme_primary_color"`
	ThemeAccentColor  string `json:"theme_accent_color"`
	ThemeFontFamily   string `json:"theme_font_family"`
	ThemeHeadingFont  string `json:"theme_heading_font"`
	ThemeDefaultMode  string `json:"theme_default_mode"`
	ThemeBorderRadius string `json:"theme_border_radius"`
	ThemeSidebarStyle string `json:"theme_sidebar_style"`
}

type SocialLinks struct {
	Facebook  string `json:"facebook"`
	Twitter   string `json:"twitter"`
	Instagram string `json:"instagram"`
	LinkedIn  string `json:"linkedin"`
	YouTube   string `json:"youtube"`
	WhatsApp  string `json:"whatsapp"`
	TikTok    string `json:"tiktok"`
}

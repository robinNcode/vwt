package model

type WebSettings struct {
	SiteName        string `json:"site_name"`
	SiteDescription string `json:"site_description"`
	LogoURL         string `json:"logo_url"`
	FaviconURL      string `json:"favicon_url"`
	Email           string `json:"email"`
	Phone           string `json:"phone"`
	Address         string `json:"address"`
	FooterText      string `json:"footer_text"`
	MetaKeywords    string `json:"meta_keywords"`
	SocialLinks     SocialLinks `json:"social_links"`
}

type SocialLinks struct {
	Facebook  string `json:"facebook"`
	Twitter   string `json:"twitter"`
	Instagram string `json:"instagram"`
	LinkedIn  string `json:"linkedin"`
}

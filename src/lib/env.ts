// Build-time flags.
//
// PUBLIC_SHOW_LABS=true  → include preview-only proofs of concept
//                          (assessment, partner grid). Never set in production.
// PUBLIC_SITE_ENV=production → the only build allowed to be indexed by search
//                          engines. Preview deployments are always noindex.

export const showLabs = import.meta.env.PUBLIC_SHOW_LABS === 'true';
export const isProduction = import.meta.env.PUBLIC_SITE_ENV === 'production';

if (isProduction && showLabs) {
  throw new Error('PUBLIC_SHOW_LABS must not be enabled for a production build.');
}

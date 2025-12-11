interface FadeInOptions {
    threshold?: number;
    rootMargin?: string;
    duration?: number;
    delay?: number;
    stagger?: number;
    customSelectors?: string[];
    excludeSelectors?: string[];
    respectMotionPreference?: boolean;
}

class ImageFadeIn {
    private observer: IntersectionObserver | null = null;
    private mutationObserver: MutationObserver | null = null;
    private options: Required<Omit<FadeInOptions, 'customSelectors' | 'excludeSelectors'>> & {
        customSelectors: string[];
        excludeSelectors: string[];
    };
    private imageCount: number = 0;
    private observedElements: WeakSet<HTMLElement> = new WeakSet();
    private debouncedObserve: (() => void) | null = null;

    constructor(options: FadeInOptions = {}) {
        this.options = {
            threshold: options.threshold ?? 0.1,
            rootMargin: options.rootMargin ?? '0px 0px -80px 0px',
            duration: options.duration ?? 800,
            delay: options.delay ?? 0,
            stagger: options.stagger ?? 50,
            customSelectors: options.customSelectors ?? [],
            excludeSelectors: options.excludeSelectors ?? [],
            respectMotionPreference: options.respectMotionPreference ?? true,
        };

        this.init();
    }

    private init(): void {
        if (!('IntersectionObserver' in window)) {
            console.warn('Intersection Observer not supported');
            return;
        }

        // Check for user's motion preference
        if (this.options.respectMotionPreference) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                console.info('Fade-in animations disabled per user preference (prefers-reduced-motion)');
                return;
            }
        }

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.fadeInElement(entry.target as HTMLElement);
                    }
                });
            },
            {
                threshold: this.options.threshold,
                rootMargin: this.options.rootMargin,
            }
        );

        // Create debounced observe function
        this.debouncedObserve = this.debounce(() => {
            this.observeCardContainers();
            this.observeImages();
            this.observeTextElements();
            this.observeCustomElements();
        }, 100);

        this.observeCardContainers();
        this.observeImages();
        this.observeTextElements();
        this.observeCustomElements();
        this.observeDOMChanges();
    }

    private debounce(func: () => void, wait: number): () => void {
        let timeout: ReturnType<typeof setTimeout> | null = null;
        return () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }

    private isWithinAnimatedContainer(element: HTMLElement): boolean {
        // 检查元素是否在已标记淡入的卡片容器内
        const container = element.closest('.grid > div, .group, .curriculum-item, .architecture-layer, [data-card-container]');
        return !!(container && container.hasAttribute('data-fade-observed'));
    }

    private observeCardContainers(): void {
        if (!this.observer) return;

        const containers = document.querySelectorAll<HTMLElement>(
            '.grid > div:not([data-fade-observed]), ' +
            '.group:not([data-fade-observed]), ' +
            '.curriculum-item:not([data-fade-observed]), ' +
            '.architecture-layer:not([data-fade-observed])'
        );

        containers.forEach((container) => {
            if (this.observedElements.has(container)) return;

            // 检查是否在屏幕内,屏幕内的不需要动画
            const rect = container.getBoundingClientRect();
            const isInViewport = (
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            );

            if (isInViewport) {
                this.observedElements.add(container);
                container.setAttribute('data-fade-observed', 'true');
                return;
            }

            // 标记容器为卡片容器
            container.setAttribute('data-card-container', 'true');

            this.observedElements.add(container);
            container.setAttribute('data-fade-observed', 'true');
            this.prepareElement(container);
            this.observer!.observe(container);
        });
    }

    private observeImages(): void {
        if (!this.observer) return;

        const images = document.querySelectorAll<HTMLElement>(
            'img:not([data-fade-observed]), ' +
            'picture:not([data-fade-observed]), ' +
            'svg:not([data-fade-observed]), ' +
            'canvas:not([data-fade-observed]), ' +
            'video:not([data-fade-observed])'
        );

        let firstContentImage: HTMLElement | null = null;

        images.forEach((img) => {
            // Skip if already observed
            if (this.observedElements.has(img)) return;

            // 新增: 如果在已动画的容器内,跳过
            if (this.isWithinAnimatedContainer(img)) {
                this.observedElements.add(img);
                img.setAttribute('data-fade-observed', 'true');
                return;
            }

            const isPriority =
                img.getAttribute('fetchpriority') === 'high' ||
                img.getAttribute('loading') === 'eager' ||
                img.hasAttribute('priority');

            const rect = img.getBoundingClientRect();
            const isInViewport = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );

            if (isInViewport && !firstContentImage && !this.isNavigationElement(img)) {
                firstContentImage = img;
            }

            const shouldExclude =
                isPriority ||
                img === firstContentImage ||
                this.shouldExcludeElement(img);

            this.observedElements.add(img);
            img.setAttribute('data-fade-observed', 'true');

            if (shouldExclude) {
                img.setAttribute('data-no-fade', 'true');
                return;
            }

            this.prepareElement(img);
            this.observer!.observe(img);
        });
    }

    private isNavigationElement(element: HTMLElement): boolean {
        // Always exclude from header, nav, footer
        const parent = element.closest('header, nav, footer, [role="navigation"]');
        if (parent) {
            return true;
        }

        // For images (not SVG, canvas, video), keep the size check
        if (!['SVG', 'CANVAS', 'VIDEO'].includes(element.tagName)) {
            const rect = element.getBoundingClientRect();
            if (rect.width < 80 && rect.height < 80) {
                return true;
            }

            const alt = element.getAttribute('alt')?.toLowerCase() || '';
            const className = element.className?.toLowerCase() || '';
            const keywords = ['logo', 'icon', 'badge'];

            if (keywords.some(keyword => alt.includes(keyword) || className.includes(keyword))) {
                return true;
            }
        }

        // For SVG, canvas, video: only exclude if explicitly in navigation context
        return false;
    }

    private shouldExcludeElement(element: HTMLElement): boolean {
        // 1. Check data-fade-in attribute for explicit control
        const fadeInAttr = element.getAttribute('data-fade-in');
        if (fadeInAttr === 'false') return true;
        if (fadeInAttr === 'true') return false;

        // 2. Check data-no-fade attribute
        if (element.hasAttribute('data-no-fade')) return true;

        // 3. Check custom exclude selectors
        if (this.options.excludeSelectors.length > 0) {
            if (this.options.excludeSelectors.some(selector => element.matches(selector))) {
                return true;
            }
        }

        // 4. Check if in navigation area
        if (this.isNavigationElement(element)) return true;

        return false;
    }

    private prepareElement(element: HTMLElement): void {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';

        // Check for custom duration
        const customDuration = element.getAttribute('data-fade-duration');
        const duration = customDuration ? parseInt(customDuration, 10) : this.options.duration;

        element.style.transition = `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.willChange = 'opacity, transform';
        element.setAttribute('data-fade-index', String(this.imageCount++));
    }

    private observeTextElements(): void {
        if (!this.observer) return;

        const textElements = document.querySelectorAll<HTMLElement>(
            'h1:not([data-fade-observed]), h2:not([data-fade-observed]), h3:not([data-fade-observed]), ' +
            'h4:not([data-fade-observed]), h5:not([data-fade-observed]), h6:not([data-fade-observed]), ' +
            'p:not([data-fade-observed]), ' +
            'li:not([data-fade-observed]), ' +
            'ul:not([data-fade-observed]), ol:not([data-fade-observed]), ' +
            'blockquote:not([data-fade-observed]), ' +
            'dd:not([data-fade-observed]), dt:not([data-fade-observed]), ' +
            'table:not([data-fade-observed]), ' +
            'pre:not([data-fade-observed]), ' +
            'article:not([data-fade-observed]), ' +
            'section:not([data-fade-observed]), ' +
            'div.content:not([data-fade-observed]), ' +
            'div.prose:not([data-fade-observed])'
        );

        textElements.forEach((element) => {
            if (this.observedElements.has(element)) return;

            // 新增: 如果在已动画的容器内,跳过
            if (this.isWithinAnimatedContainer(element)) {
                this.observedElements.add(element);
                element.setAttribute('data-fade-observed', 'true');
                return;
            }

            this.observedElements.add(element);
            element.setAttribute('data-fade-observed', 'true');

            // 检查是否在文章内容区 - 文章区所有文字都不淡入
            const isInArticle = element.closest('.prose, [data-article-content]');
            if (isInArticle) {
                return; // 文章内容区的所有文字元素都不淡入
            }

            // 检查导航区域
            const parent = element.closest('header, nav, footer, [role="navigation"]');
            if (parent) {
                return;
            }

            const rect = element.getBoundingClientRect();
            const isInViewport = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );

            if (isInViewport) {
                return;
            }

            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), transform 600ms cubic-bezier(0.4, 0, 0.2, 1)`;
            element.style.willChange = 'opacity, transform';
            element.setAttribute('data-fade-index', String(this.imageCount++));

            this.observer!.observe(element);
        });
    }

    private observeCustomElements(): void {
        if (!this.observer || this.options.customSelectors.length === 0) return;

        const customElements = document.querySelectorAll<HTMLElement>(
            this.options.customSelectors.join(', ')
        );

        customElements.forEach((element) => {
            // Skip if already observed
            if (this.observedElements.has(element)) return;

            this.observedElements.add(element);
            element.setAttribute('data-fade-observed', 'true');

            if (this.shouldExcludeElement(element)) {
                element.setAttribute('data-no-fade', 'true');
                return;
            }

            this.prepareElement(element);
            this.observer!.observe(element);
        });
    }

    private fadeInElement(element: HTMLElement): void {
        if (!this.observer) return;

        const fadeIndex = parseInt(element.getAttribute('data-fade-index') || '0', 10);

        // Check for custom delay
        const customDelay = element.getAttribute('data-fade-delay');
        const baseDelay = customDelay ? parseInt(customDelay, 10) : this.options.delay;
        const staggerDelay = fadeIndex * this.options.stagger;
        const totalDelay = baseDelay + staggerDelay;

        // Get duration for cleanup timing
        const customDuration = element.getAttribute('data-fade-duration');
        const duration = customDuration ? parseInt(customDuration, 10) : this.options.duration;

        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';

            setTimeout(() => {
                this.observer?.unobserve(element);
                element.removeAttribute('data-fade-index');
                element.style.willChange = 'auto';
                element.style.transition = '';
                element.style.transform = '';
            }, duration);
        }, totalDelay);
    }

    private observeDOMChanges(): void {
        this.mutationObserver = new MutationObserver((mutations) => {
            let hasNewContent = false;

            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node as HTMLElement;
                            if (
                                element.tagName === 'IMG' ||
                                element.tagName === 'PICTURE' ||
                                element.tagName === 'SVG' ||
                                element.tagName === 'CANVAS' ||
                                element.tagName === 'VIDEO' ||
                                element.querySelector('img, picture, svg, canvas, video')
                            ) {
                                hasNewContent = true;
                            }
                        }
                    });
                }
            });

            if (hasNewContent && this.debouncedObserve) {
                this.debouncedObserve();
            }
        });

        this.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    public reinit(): void {
        this.imageCount = 0;
        this.observeCardContainers();
        this.observeImages();
        this.observeTextElements();
        this.observeCustomElements();
    }

    public destroy(): void {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }
    }
}

if (typeof window !== 'undefined') {
    import('@/utils/page-init').then(({ registerPageInit }) => {
        registerPageInit('imageFadeIn', () => {
            const fadeInInstance = new ImageFadeIn({
                threshold: 0.1,
                rootMargin: '0px 0px -80px 0px',
                duration: 800,
                delay: 0,
                stagger: 50,
                respectMotionPreference: true,
            });

            // 返回清理函数
            return () => {
                fadeInInstance.destroy();
            };
        });
    });
}

export default ImageFadeIn;

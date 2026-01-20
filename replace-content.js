import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Language-specific placeholder templates
const placeholders = {
    de: {
        title: 'Platzhalter Titel',
        description: 'Dies ist eine kurze Platzhalterbeschreibung des Artikelinhalts.',
        category: 'Investition',
        tags: ['Strategie'],
        heroImageAlt: 'Platzhalter Bildbeschreibung',
        content: `## Einführung

Dies ist ein Platzhalter-Artikel, der verschiedene Markdown-Elemente demonstriert.

![Platzhalter Bild](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800)

## Hauptinhalt

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hier ist ein Beispiel für **fettgedruckten Text** und *kursiven Text*.

### Unterabschnitt

Eine Liste von Elementen:

- Erster Punkt
- Zweiter Punkt
- Dritter Punkt

### Code-Beispiel

\`\`\`javascript
function beispiel() {
  console.log("Hallo Welt!");
  return true;
}
\`\`\`

## Fazit

Dies ist der Schlussabsatz des Platzhalter-Artikels.`
    },
    en: {
        title: 'Placeholder Title',
        description: 'This is a brief placeholder description of the article content.',
        category: 'Investment',
        tags: ['Strategy'],
        heroImageAlt: 'Placeholder image description',
        content: `## Introduction

This is a placeholder article demonstrating various Markdown elements.

![Placeholder Image](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800)

## Main Content

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Here's an example of **bold text** and *italic text*.

### Subsection

A list of items:

- First item
- Second item
- Third item

### Code Example

\`\`\`javascript
function example() {
  console.log("Hello World!");
  return true;
}
\`\`\`

## Conclusion

This is the concluding paragraph of the placeholder article.`
    },
    es: {
        title: 'Título de marcador de posición',
        description: 'Esta es una breve descripción de marcador de posición del contenido del artículo.',
        category: 'Inversión',
        tags: ['Estrategia'],
        heroImageAlt: 'Descripción de imagen de marcador de posición',
        content: `## Introducción

Este es un artículo de marcador de posición que demuestra varios elementos de Markdown.

![Imagen de marcador de posición](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800)

## Contenido Principal

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aquí hay un ejemplo de **texto en negrita** y *texto en cursiva*.

### Subsección

Una lista de elementos:

- Primer elemento
- Segundo elemento
- Tercer elemento

### Ejemplo de Código

\`\`\`javascript
function ejemplo() {
  console.log("¡Hola Mundo!");
  return true;
}
\`\`\`

## Conclusión

Este es el párrafo final del artículo de marcador de posición.`
    },
    fr: {
        title: 'Titre de l\'espace réservé',
        description: 'Ceci est une brève description de l\'espace réservé du contenu de l\'article.',
        category: 'Investissement',
        tags: ['Stratégie'],
        heroImageAlt: 'Description de l\'image de l\'espace réservé',
        content: `## Introduction

Ceci est un article d'espace réservé démontrant divers éléments Markdown.

![Image d'espace réservé](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800)

## Contenu Principal

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Voici un exemple de **texte en gras** et *texte en italique*.

### Sous-section

Une liste d'éléments:

- Premier élément
- Deuxième élément
- Troisième élément

### Exemple de Code

\`\`\`javascript
function exemple() {
  console.log("Bonjour le monde!");
  return true;
}
\`\`\`

## Conclusion

Ceci est le paragraphe final de l'article d'espace réservé.`
    },
    id: {
        title: 'Judul Placeholder',
        description: 'Ini adalah deskripsi placeholder singkat dari konten artikel.',
        category: 'Investasi',
        tags: ['Strategi'],
        heroImageAlt: 'Deskripsi gambar placeholder',
        content: `## Pendahuluan

Ini adalah artikel placeholder yang mendemonstrasikan berbagai elemen Markdown.

![Gambar Placeholder](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800)

## Konten Utama

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Berikut adalah contoh **teks tebal** dan *teks miring*.

### Subbagian

Daftar item:

- Item pertama
- Item kedua
- Item ketiga

### Contoh Kode

\`\`\`javascript
function contoh() {
  console.log("Halo Dunia!");
  return true;
}
\`\`\`

## Kesimpulan

Ini adalah paragraf penutup dari artikel placeholder.`
    },
    ja: {
        title: 'プレースホルダータイトル',
        description: 'これは記事内容の簡単なプレースホルダー説明です。',
        category: '投資',
        tags: ['戦略'],
        heroImageAlt: 'プレースホルダー画像の説明',
        content: `## はじめに

これは様々なMarkdown要素を示すプレースホルダー記事です。

![プレースホルダー画像](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800)

## メインコンテンツ

Lorem ipsum dolor sit amet, consectetur adipiscing elit. **太字テキスト**と*斜体テキスト*の例です。

### サブセクション

項目のリスト:

- 最初の項目
- 2番目の項目
- 3番目の項目

### コード例

\`\`\`javascript
function example() {
  console.log("こんにちは世界！");
  return true;
}
\`\`\`

## 結論

これはプレースホルダー記事の締めくくりの段落です。`
    },
    ko: {
        title: '자리 표시자 제목',
        description: '이것은 기사 내용에 대한 간단한 자리 표시자 설명입니다.',
        category: '투자',
        tags: ['전략'],
        heroImageAlt: '자리 표시자 이미지 설명',
        content: `## 소개

다양한 Markdown 요소를 보여주는 자리 표시자 기사입니다.

![자리 표시자 이미지](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800)

## 주요 내용

Lorem ipsum dolor sit amet, consectetur adipiscing elit. **굵은 텍스트**와 *기울임 텍스트*의 예입니다.

### 하위 섹션

항목 목록:

- 첫 번째 항목
- 두 번째 항목
- 세 번째 항목

### 코드 예제

\`\`\`javascript
function example() {
  console.log("안녕하세요 세계!");
  return true;
}
\`\`\`

## 결론

자리 표시자 기사의 마무리 단락입니다.`
    },
    pt: {
        title: 'Título do espaço reservado',
        description: 'Esta é uma breve descrição do espaço reservado do conteúdo do artigo.',
        category: 'Investimento',
        tags: ['Estratégia'],
        heroImageAlt: 'Descrição da imagem do espaço reservado',
        content: `## Introdução

Este é um artigo de espaço reservado demonstrando vários elementos Markdown.

![Imagem de espaço reservado](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800)

## Conteúdo Principal

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aqui está um exemplo de **texto em negrito** e *texto em itálico*.

### Subseção

Uma lista de itens:

- Primeiro item
- Segundo item
- Terceiro item

### Exemplo de Código

\`\`\`javascript
function exemplo() {
  console.log("Olá Mundo!");
  return true;
}
\`\`\`

## Conclusão

Este é o parágrafo final do artigo de espaço reservado.`
    },
    ru: {
        title: 'Заголовок-заполнитель',
        description: 'Это краткое описание-заполнитель содержания статьи.',
        category: 'Инвестиции',
        tags: ['Стратегия'],
        heroImageAlt: 'Описание изображения-заполнителя',
        content: `## Введение

Это статья-заполнитель, демонстрирующая различные элементы Markdown.

![Изображение-заполнитель](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800)

## Основное Содержание

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Вот пример **жирного текста** и *курсивного текста*.

### Подраздел

Список элементов:

- Первый элемент
- Второй элемент
- Третий элемент

### Пример Кода

\`\`\`javascript
function example() {
  console.log("Привет мир!");
  return true;
}
\`\`\`

## Заключение

Это заключительный абзац статьи-заполнителя.`
    },
    zh: {
        title: '占位符标题',
        description: '这里是关于文章内容的简要占位符描述。',
        category: '投资',
        tags: ['策略'],
        heroImageAlt: '占位符图片背景描述',
        content: `## 介绍

这是一篇展示各种 Markdown 元素的占位符文章。

![占位符图片](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800)

## 主要内容

Lorem ipsum dolor sit amet, consectetur adipiscing elit. 这里是**粗体文本**和*斜体文本*的示例。

### 子章节

项目列表：

- 第一项
- 第二项
- 第三项

### 代码示例

\`\`\`javascript
function example() {
  console.log("你好世界！");
  return true;
}
\`\`\`

## 结论

这是占位符文章的结尾段落。`
    }
};

// Function to generate markdown content with placeholders
function generateMarkdownContent(lang, originalContent) {
    const placeholder = placeholders[lang];

    // Extract existing frontmatter values we want to preserve
    const pubDateMatch = originalContent.match(/pubDate:\s*(.+)/);
    const authorMatch = originalContent.match(/author:\s*"?(.+?)"?\s*$/m);
    const heroImageMatch = originalContent.match(/heroImage:\s*"(.+)"/);
    const draftMatch = originalContent.match(/draft:\s*(.+)/);
    const featuredMatch = originalContent.match(/featured:\s*(.+)/);

    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '2016-06-05';
    const author = authorMatch ? authorMatch[1].trim() : 'Astro';
    const heroImage = heroImageMatch ? heroImageMatch[1] : 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d';
    const draft = draftMatch ? draftMatch[1].trim() : 'false';
    const featured = featuredMatch ? featuredMatch[1].trim() : 'false';

    return `---
title: "${placeholder.title}"
description: "${placeholder.description}"
category: "${placeholder.category}"
tags:
  - "${placeholder.tags[0]}"
pubDate: ${pubDate}
author: "${author}"
heroImage: "${heroImage}"
heroImageAlt: "${placeholder.heroImageAlt}"
draft: ${draft}
featured: ${featured}
locales: ${lang}
---

${placeholder.content}
`;
}

// Function to process all markdown files in a language folder
function processLanguageFolder(lang) {
    const folderPath = path.join(__dirname, 'src', 'content', 'posts', lang);

    if (!fs.existsSync(folderPath)) {
        console.log(`Folder not found: ${folderPath}`);
        return;
    }

    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.md'));

    console.log(`Processing ${files.length} files in ${lang} folder...`);

    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        const originalContent = fs.readFileSync(filePath, 'utf-8');
        const newContent = generateMarkdownContent(lang, originalContent);

        fs.writeFileSync(filePath, newContent, 'utf-8');
    });

    console.log(`✓ Completed ${lang} folder`);
}

// Main execution
const languages = ['de', 'en', 'es', 'fr', 'id', 'ja', 'ko', 'pt', 'ru', 'zh'];

console.log('Starting markdown content replacement...\n');

languages.forEach(lang => {
    processLanguageFolder(lang);
});

console.log('\n✓ All files processed successfully!');

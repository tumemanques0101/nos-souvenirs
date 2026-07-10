# Une Lettre - Huong dan chinh sua

Trang nay la mot website tinh. Mo file `index.html` trong trinh duyet la chay duoc, khong can cai Node.js hay chay server.

## Luong hoat dong

1. Man hinh dau hien phong bi va nut `Open`.
2. Bam `Open` de hien o nhap mat khau va goi y.
3. Dung mat khau de mo phong bi, la thu truot ra va noi dung hien dan.
4. Bam `Next` de xem ky niem tung trang. Nut mui ten o goc trai album dua ve la thu.
5. Den trang cuoi, bam `Go to a wish` de xem loi chuc.
6. Cham vao man hinh loi chuc de gap giay, dong phong bi, quan ruy bang va that no.

## Can sua gi o dau?

| Muon thay doi | File | Cho can tim |
| --- | --- | --- |
| Tieu de, nut bam, cau chu tren man hinh | `index.html` | Noi dung giua cac the HTML |
| Mat khau | `js/main.js` | `passcodes: ["unelettre"]` |
| Thoi gian o goc | `js/main.js` | `openAt`, `demoOpenMinutesFromNow`, `enforceOpenTime` |
| Noi dung la thu | `js/main.js` | Mang `paragraphs` |
| So trang ky niem | `js/main.js` | `const MEMORY_PAGE_LIMIT = 30` |
| Ngay, tieu de, mo ta va anh 3 trang mau | `js/main.js` | Mang `seeds` trong ham `createMemoryPages` |
| Anh/video ky niem | Dat file trong `assets/`, sau do doi `source` trong `js/main.js` |
| Mau sac, phong bi, no, giay va trang tri | `css/style.css` |
| Chuyen dong mo thu, gap thu va that no | `css/animation.css` |
| Giao dien dien thoai | `css/responsive.css` |

## Chinh 30 trang ky niem

File: `js/main.js`

Dong nay quy dinh tong so trang:

```js
const MEMORY_PAGE_LIMIT = 30;
```

Vi du, doi thanh `12` neu chi muon giu 12 trang. Cac trang tu 4 den 30 la trang mau lap lai de de thay the hoac bot di.

Ba trang dau co noi dung mau trong mang `seeds`. Moi trang co dang:

```js
{
  date: "17 March 2024, 4:32 PM",
  title: "Soft light",
  caption: "A small pause that made the whole afternoon feel warmer.",
  alt: "Mo ta anh cho nguoi dung trinh doc man hinh",
  source: "assets/memory-1.svg",
  type: "image",
  tilt: "-2.2deg",
  decoration: "petals"
}
```

Gia tri `decoration` co the dung: `petals`, `star`, hoac `ribbon`.

## Them anh hoac video that

1. Chep file anh/video vao thu muc `assets`.
2. Doi gia tri `source` thanh duong dan moi, vi du `assets/ky-niem-04.jpg`.
3. Doi `type`:

```js
type: "image" // cho JPG, PNG, WEBP, SVG
type: "video" // cho MP4, WEBM
```

Video se hien trong tung trang ky niem voi thanh dieu khien phat video. Anh co the bam de xem lon.

## Cac file logic

| File | Chuc nang |
| --- | --- |
| `js/main.js` | Cau hinh noi dung va dieu phoi toan bo cac man hinh |
| `js/password.js` | Nut mo, goi y, mat khau va dong ho |
| `js/envelope.js` | Goi animation mo phong bi |
| `js/animation.js` | Hieu ung phong bi, giay, ruy bang va manh no roi |
| `js/typewriter.js` | Hieu ung chu hien tung ky tu trong la thu |
| `js/gallery.js` | Ky niem tung trang, nut truoc/sau va phong to anh |
| `js/ending.js` | Canh gap giay, dong phong bi, quan ruy bang va that no |
| `js/intro.js` | Khoi tao man hinh dau |

`js/app.js` la file cu va **khong duoc nap trong `index.html`**. Khong can sua file nay.

## Cac file giao dien

| File | Chuc nang |
| --- | --- |
| `index.html` | Khung cua tat ca man hinh va cac cau chu tren giao dien |
| `css/style.css` | Toan bo giao dien chinh: nen, phong bi, no hong, giay, ky niem, canh ket |
| `css/animation.css` | Keyframe va thoi gian chuyen dong |
| `css/responsive.css` | Kich thuoc va bo cuc tren dien thoai |

No hong la SVG vector `assets/pink-bow.svg`. Vi tri va kich thuoc no nam trong `css/style.css`, ngay duoi ghi chu `The bow is a dedicated SVG vector`.

## Tai nguyen

Thu muc `assets` dang co 3 anh mau:

- `assets/memory-1.svg`
- `assets/memory-2.svg`
- `assets/memory-3.svg`
- `assets/pink-bow.svg` - no hong vector cua phong bi va canh ket

Co the giu ten file nay va ghi de anh moi len, hoac them file moi roi sua `source` trong `js/main.js`.

## Luu y truoc khi sua

- Chi can sua `index.html`, cac file trong `css/`, `js/main.js` va `assets/` la du cho viec cap nhat noi dung.
- Sau khi sua, tai lai trang bang `Ctrl + F5` neu trinh duyet dang dung ban cu trong bo nho dem.
- Giu nguyen ID nhu `#lockScreen`, `#letterScreen`, `#memoryGrid`, `#closingEnvelope`; JavaScript dang dung chung de dieu khien animation.

import { SyntheticEvent, UIEvent, useEffect, useMemo, useRef, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { ActionCard, Button, Icon, Spinner } from 'xtreme-ui';

import SearchButton from '#components/base/SearchButton';
import SideSheet from '#components/base/SideSheet';
import Modal from '#components/layout/Modal';
import { useQueryParams } from '#utils/hooks/useQueryParams';

import CartPage from './CartPage';
import MenuCard from './MenuCard';
import UserLogin from './UserLogin';
import './orderPage.scss';

// انواع داده‌های دستی
type TMenu = {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    image?: string;
    hidden?: boolean;
};

type TRestaurant = {
    username: string;
    profile: {
        categories: string[];
    };
    tables: Array<{ username: string }>;
    menus: TMenu[];
};

const OrderPage = () => {
    const session = useSession();
    const params = useQueryParams();
    const table = params.get('table');
    const searchParam = params.get('search')?.trim() ?? '';
    const categoryParam = params.get('category')?.trim();
    const category = useMemo(() => (categoryParam ? categoryParam.split(',') : []), [categoryParam]);

    // داده‌های دستی رستوران
    const restaurant: TRestaurant = {
        username: 'test-restaurant',
        profile: {
            categories: ['پیش‌غذا', 'غذای اصلی', 'دسر', 'نوشیدنی' ],
        },
        tables: [{ username: 'table-1' }, { username: 'table-2' }],
        menus: [
            {
                _id: '1',
                name: 'پیتزا مارگاریتا',
                description: 'پیتزا با سس گوجه و پنیر موزارلا',
                category: 'غذای اصلی',
                price: 120000,
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCKqzrE2hZnTGh65h_SlXd8X8V75HXdXC3Eg&s',
            },
            {
                _id: '2',
                name: 'سالاد سزار',
                description: 'سالاد با سس سزار و نان تست',
                category: 'پیش‌غذا',
                price: 60000,
				                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCKqzrE2hZnTGh65h_SlXd8X8V75HXdXC3Eg&s',

            },       {
                _id: '55',
                name: 'سالاد سزار',
                description: 'سالاد با سس سزار و نان تست',
                category: 'پیش‌غذا',
                price: 60000,
				                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCKqzrE2hZnTGh65h_SlXd8X8V75HXdXC3Eg&s',

            },       {
                _id: '44',
                name: 'سالاد سزار',
                description: 'سالاد با سس سزار و نان تست',
                category: 'پیش‌غذا',
                price: 60000,
				                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCKqzrE2hZnTGh65h_SlXd8X8V75HXdXC3Eg&s',

            },       {
                _id: '99',
                name: 'سالاد سزار',
                description: 'سالاد با سس سزار و نان تست',
                category: 'پیش‌غذا',
                price: 60000,
				                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCKqzrE2hZnTGh65h_SlXd8X8V75HXdXC3Eg&s',

            },       {
                _id: '88',
                name: 'سالاد سزار',
                description: 'سالاد با سس سزار و نان تست',
                category: 'پیش‌غذا',
                price: 60000,
				                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCKqzrE2hZnTGh65h_SlXd8X8V75HXdXC3Eg&s',

            },
            {
                _id: '3',
                name: 'چیزکیک',
                description: 'دسر خامه‌ای با بیسکویت',
                category: 'دسر',
                price: 80000,
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCKqzrE2hZnTGh65h_SlXd8X8V75HXdXC3Eg&s',
            },
            {
                _id: '4',
                name: 'نوشابه',
                description: 'نوشابه گازدار',
                category: 'نوشیدنی',
                price: 20000,
				                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCKqzrE2hZnTGh65h_SlXd8X8V75HXdXC3Eg&s',

            },
        ],
    };

    const menus = restaurant.menus;
    const [selectedProducts, setSelectedProducts] = useState<Array<TMenu & { quantity: number }>>([]);
    const [loginOpen, setLoginOpen] = useState(false);
    const [sideSheetOpen, setSideSheetOpen] = useState(false);
    const [topHeading, setTopHeading] = useState(['منو', 'دسته‌بندی']);
    const [orderHeading, setOrderHeading] = useState(['گزینه‌ها', 'منو']);
    const [sideSheetHeading, setSideSheetHeading] = useState(['سبد', 'خرید']);

    const [searchActive, setSearchActive] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [floatHeader, setFloatHeader] = useState(false);
    const [leftCategoryScroll, setLeftCategoryScroll] = useState(false);
    const [rightCategoryScroll, setRightCategoryScroll] = useState(true);
    const [showInfoCard, setShowInfoCard] = useState<string | false>(false);

    // فیلتر محصولات بر اساس جستجو و دسته‌بندی
    const filteredProducts = useMemo(() => {
        const search = searchParam.toLowerCase();
        return menus
            .filter(({ name, description, category: cat }) => {
                const matchesSearch = search
                    ? name.toLowerCase().includes(search) || 
                      description.toLowerCase().includes(search) || 
                      cat.toLowerCase().includes(search)
                    : true;
                const matchesCategory = category.length ? category.includes(cat) : true;
                return matchesSearch && matchesCategory;
            })
            .map((product) => ({
                ...product,
                quantity: selectedProducts.find((p) => p._id === product._id)?.quantity || 0,
            }));
    }, [category, menus, searchParam, selectedProducts]);

    const hasImageItems = useMemo(() => filteredProducts.some((product) => !!product.image), [filteredProducts]);
    const hasNonImageItems = useMemo(() => filteredProducts.some((product) => !product.image), [filteredProducts]);
    const showOrderButton = restaurant.tables.some(({ username }) => username === table);
    const eligibleToOrder = session.data?.role === 'customer' && showOrderButton;

    // توابع مدیریت اسکرول و دسته‌بندی
    const order = useRef<HTMLDivElement>(null);
    const categories = useRef<HTMLDivElement>(null);

    const onMenuScroll = (event: UIEvent<HTMLDivElement>) => {
        const scrollTop = (event.target as HTMLDivElement).scrollTop;
        if (scrollTop > 30) {
            setFloatHeader(true);
            setTopHeading(['منو', 'دسته‌بندی']);
            if (order?.current && scrollTop >= order?.current?.offsetTop - 15) setTopHeading(orderHeading);
            return;
        }
        setFloatHeader(false);
    };

    const onCategoryScroll = (event: SyntheticEvent) => {
        const target = event.target as HTMLElement;
        setLeftCategoryScroll(target.scrollLeft > 50);
        setRightCategoryScroll(Math.round(target.scrollWidth - target.scrollLeft) - 50 > target.clientWidth);
    };

    const categoryScrollLeft = () => {
        if (categories.current) categories.current.scrollLeft -= 400;
    };

    const categoryScrollRight = () => {
        if (categories.current) categories.current.scrollLeft += 400;
    };

    const onCategoryClick = (categoryName: string) => {
        const newCategory = category.includes(categoryName)
            ? category.filter((item) => item !== categoryName)
            : [...category, categoryName];
        params.set({ category: newCategory.join(',') });
    };

    const onLoginClick = () => {
        if (table) return setLoginOpen(true);
        return params.router.push('/scan');
    };

    const increaseProductQuantity = (product: TMenu) => {
        setSelectedProducts((prev) => {
            const existing = prev.find((p) => p._id === product._id);
            if (existing) {
                return prev.map((p) =>
                    p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const decreaseProductQuantity = (product: TMenu) => {
        setSelectedProducts((prev) => {
            const existing = prev.find((p) => p._id === product._id);
            if (!existing) return prev;

            if (existing.quantity <= 1) {
                return prev.filter((p) => p._id !== product._id);
            }
            return prev.map((p) =>
                p._id === product._id ? { ...p, quantity: p.quantity - 1 } : p
            );
        });
    };

    return (
        <div className="orderPage">
            <div className="mainContainer" onScroll={onMenuScroll}>
                <div className={`mainHeader ${searchActive ? 'searchActive' : ''} ${floatHeader ? 'floatHeader' : ''}`}>
                    <h1>{topHeading[0]} <span>{topHeading[1]}</span></h1>
                    <div className="options">
                        <SearchButton
                            setSearchActive={setSearchActive}
                            placeholder="جستجو در منو"
                            value={searchValue}
                            setValue={setSearchValue}
                        />
                        {/* {(!session.data?.role || !showOrderButton) && (
                            <Button
                                className="loginButton"
                                label={showOrderButton ? 'سفارش' : 'اسکن میز'}
                                onClick={onLoginClick}
                            /> */}
                        {/* )} */}
                        {true && (
                            <Button
                                icon="e43b"
                                label={(selectedProducts?.length > 0 ? selectedProducts?.length : '') + ''}
                                onClick={() => setSideSheetOpen(true)}
                            />
                        )}
                        {session.data?.role === 'admin' && (
                            <Button
                                className="dashboardButton"
                                label="داشبورد"
                                icon="e09f"
                                iconType="solid"
                                onClick={() => params.router.push('/dashboard')}
                            />
                        )}
                        {session.data?.role === 'kitchen' && (
                            <Button
                                className="kitchenButton"
                                label="آشپزخانه"
                                icon="e09f"
                                iconType="solid"
                                onClick={() => params.router.push('/kitchen')}
                            />
                        )}
                    </div>
                </div>
                <div className="category">
                    <div className="itemCategories" ref={categories} onScroll={onCategoryScroll}>
                        {restaurant.profile.categories.map((item, i) => (
                            <ActionCard
                                key={i}
                                className={`menuCategory ${category.includes(item) ? 'active' : ''}`}
                                onClick={() => onCategoryClick(item)}
                            >
                                <span className="title">{item}</span>
                            </ActionCard>
                        ))}
                        <div className="space" />
                        {/* <div className={`scrollLeft ${leftCategoryScroll ? 'show' : ''}`} onClick={categoryScrollLeft}>
                            <Icon code="f053" />
                        </div> */}
                        {/* <div className={`scrollRight ${rightCategoryScroll ? 'show' : ''}`} onClick={categoryScrollRight}>
                            <Icon code="f054" />
                        </div> */}
                    </div>
                </div>
                <div className="order" ref={order}>
                    <div className="header">
                        <h1>{orderHeading[0]} <span>{orderHeading[1]}</span></h1>
                    </div>
                    {hasImageItems && (
                        <div className={`itemContainer ${!eligibleToOrder ? 'restrictOrder ' : ''}`}>
                            <div>
                                {filteredProducts
                                    .filter((item) => !item.hidden && !!item.image)
                                    .map((item, key) => (
                                        <MenuCard
                                            key={key}
                                            item={item}
                                            restrictOrder={!eligibleToOrder}
                                            increaseQuantity={increaseProductQuantity}
                                            decreaseQuantity={decreaseProductQuantity}
                                            showInfo={item._id === showInfoCard}
                                            setShowInfo={setShowInfoCard}
                                            show={true}
                                            quantity={selectedProducts.find((p) => p._id === item._id)?.quantity || 0}
                                        />
                                    ))}
                            </div>
                        </div>
                    )}
                    {hasImageItems && hasNonImageItems && <hr />}
                    {hasNonImageItems && (
                        <div className={`itemContainer withoutImage ${!eligibleToOrder ? 'restrictOrder ' : ''}`}>
                            <div>
                                {filteredProducts
                                    .filter((item) => !item.hidden && !item.image)
                                    .map((item, key) => (
                                        <MenuCard
                                            key={key}
                                            item={item}
                                            restrictOrder={!eligibleToOrder}
                                            increaseQuantity={increaseProductQuantity}
                                            decreaseQuantity={decreaseProductQuantity}
                                            showInfo={item._id === showInfoCard}
                                            setShowInfo={setShowInfoCard}
                                            show={false}
                                            quantity={selectedProducts.find((p) => p._id === item._id)?.quantity || 0}
                                        />
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <SideSheet title={sideSheetHeading} open={sideSheetOpen} setOpen={setSideSheetOpen}>
                <CartPage
                    selectedProducts={selectedProducts}
                    increaseProductQuantity={increaseProductQuantity}
                    decreaseProductQuantity={decreaseProductQuantity}
                    resetSelectedProducts={() => setSelectedProducts([])}
                    setSideSheetHeading={setSideSheetHeading}
                />
            </SideSheet>
            <Modal open={loginOpen} setOpen={setLoginOpen}>
                <UserLogin setOpen={setLoginOpen} />
            </Modal>
        </div>
    );
};

export default OrderPage;
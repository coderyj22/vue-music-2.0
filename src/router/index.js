import Vue from 'vue';
import VueRouter from "vue-router";

Vue.use(VueRouter);

const Recommend = () => import(/* webpackChunkName: "recommend&&singer&&rank" */'views/recommend/Recommend')
const Singer = () => import(/* webpackChunkName: "recommend&&singer&&rank" */'views/singer/Singer')
const Rank = () => import(/* webpackChunkName: "recommend&&singer&&rank" */'views/rank/Rank')

const Search = () => import(/* webpackChunkName: "search&&singerdetail" */'views/search/Search')
const SingerDetail = () => import(/* webpackChunkName: "search&&singerdetail" */'components/singerdetail/SingerDetail')

const Disc = () => import(/* webpackChunkName: "Disc&&TopList&&Profile" */'components/disc/Disc')
const TopList = () => import(/* webpackChunkName: "Disc&&TopList&&Profile" */'components/toplist/TopList')
const Profile = () => import(/* webpackChunkName: "Disc&&TopList&&Profile" */'components/profile/Profile')


// import Recommend from "../views/recommend/Recommend";
// import Singer from "../views/singer/Singer";
// import Rank from "../views/rank/Rank";
// import Search from "../views/search/Search";
//
// import SingerDetail from "../components/singerdetail/SingerDetail";
// import Disc from "../components/disc/Disc";
// import TopList from "../components/toplist/TopList";
// import Profile from "../components/profile/Profile";

const routes = [
	{
		path: '/',
		redirect: '/recommend'
	},
	{
		path: "/recommend",
		component: Recommend,
		children: [
			{
				path: ':id',
				component: Disc
			}
		]
	},
	{
		path: "/singer",
		component: Singer,
		children: [
			{
				path: ":id",
				component: SingerDetail
			}
		]
	},
	{
		path: "/rank",
		component: Rank,
		children: [
			{
				path: ':id',
				component: TopList
			}
		]
	},
	{
		path: "/search",
		component: Search,
		children: [
			{
				path: ":id",
				component: SingerDetail
			}
		]
	},
	{
		path: '/profile',
		component: Profile
	}
];

export default new VueRouter({
	routes,
	mode: 'hash'
})

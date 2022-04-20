<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link class="nav-link" exact :class="{active: tab === 'your_feed'}" :to="{name:'home',query: {tab:'your_feed'}}" >Your Feed</nuxt-link>
              </li>
              <li class="nav-item" >
              <nuxt-link class="nav-link" exact :class="{active: tab === 'global_feed'}" :to="{name:'home',query: {tab:'global_feed'}}">Global Feed</nuxt-link>
              </li>
              <li class="nav-item" v-if="tag" >
                <nuxt-link class="nav-link" exact :class="{active: tab === 'tab'}" :to="{name:'home',query: {tab: 'tag',tag}}">#{{tag}}</nuxt-link>
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="(article, articleIndex) in articles"
            :key="articleIndex"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: { username: article.author.username },
                  }"
                  class="author"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                @click="onFavorite(article)"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{ active: item === page }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                    },
                  }"
                  >{{ item }}</nuxt-link
                >
                <!-- {{item}} -->
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <nuxt-link
                v-for="tag in tags"
                :key="tag"
                :to="{
                  name: 'home',
                  query: {
                    tab: 'tag',
                    tag,
                  },
                }"
                class="tag-pill tag-default"
                >{{ tag }}</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArticles,
  getYourFeedArticles,
  addFavorite,
  deleteFavorite,
} from "@/api/article";
import { getTags } from "@/api/tag";
import { mapState } from "vuex";
export default {
  watchQuery: ["page", "tag", "tab"],

  async asyncData({ query,store }) {
    const page = +query.page || 1;
    const tag = query.tag || null;
    const tab = query.tab || 'global_feed'
    const limit = 20
    const loadArticles = store.state.user &&  tab === 'your_feed' ? getYourFeedArticles : getArticles
    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag,
      }),
      getTags(),
    ]);
    // console.log(tagRes.data.tags);
    const { articles, articlesCount } = articleRes.data;
    const { tags } = tagRes.data;
    return {
      articles: articles,
      articlesCount: articlesCount,
      tags,
      limit,
      page,
      tag,
      tab
    };
  },

  name: "HomeIndex",

  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },

  // watch

  methods: {
      async onFavorite(article) {
        article.favoriteDisabled = true;
        if (article.favorited) {
          // 取消点赞
          await deleteFavorite(article.slug);
          article.favorited = false;
          article.favoritesCount += -1;
        } else {
          // 添加点赞
          await addFavorite(article.slug);
          article.favorited = true;
          article.favoritesCount += 1;
        }
        article.favoriteDisabled = false;
      },
  }
};
</script>

<style>
</style>
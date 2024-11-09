import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { TagItem } from "../types/store";

export const useTagsStore = defineStore("tags", () => {
    const list = ref<TagItem[]>([]);

    const show = computed(() => {
        return list.value.length > 0;
    });

    const nameList = computed(() => {
        return list.value.map((item) => item.name);
    });

    function delTagsItem(index: number) {
        list.value.splice(index, 1);
    }

    function setTagsItem(data: TagItem) {
        list.value.push(data);
    }

    function clearTags() {
        list.value = [];
    }

    function closeTagsOther(data: TagItem[]) {
        list.value = data;
    }

    function closeCurrentTag(data: any) {
        for (let i = 0, len = list.value.length; i < len; i++) {
            const item = list.value[i];
            if (item.path === data.$route.fullPath) {
                if (i < len - 1) {
                    data.$router.push(list.value[i + 1].path);
                } else if (i > 0) {
                    data.$router.push(list.value[i - 1].path);
                } else {
                    data.$router.push("/");
                }
                list.value.splice(i, 1);
                break;
            }
        }
    }

    return {
        list,
        show,
        nameList,
        delTagsItem,
        setTagsItem,
        clearTags,
        closeTagsOther,
        closeCurrentTag,
    };

    // state: () => {
    // 	return {
    // 		list: <ListItem[]>[]
    // 	};
    // },
    // getters: {
    // 	show: state => {
    // 		return state.list.length > 0;
    // 	},
    // 	nameList: state => {
    // 		return state.list.map(item => item.name);
    // 	}
    // },
    // actions: {
    // 	delTagsItem(index: number) {
    // 		this.list.splice(index, 1);
    // 	},
    // 	setTagsItem(data: ListItem) {
    // 		this.list.push(data);
    // 	},
    // 	clearTags() {
    // 		this.list = [];
    // 	},
    // 	closeTagsOther(data: ListItem[]) {
    // 		this.list = data;
    // 	},
    // 	closeCurrentTag(data: any) {
    // 		for (let i = 0, len = this.list.length; i < len; i++) {
    // 			const item = this.list[i];
    // 			if (item.path === data.$route.fullPath) {
    // 				if (i < len - 1) {
    // 					data.$router.push(this.list[i + 1].path);
    // 				} else if (i > 0) {
    // 					data.$router.push(this.list[i - 1].path);
    // 				} else {
    // 					data.$router.push('/');
    // 				}
    // 				this.list.splice(i, 1);
    // 				break;
    // 			}
    // 		}
    // 	}
    // }
});

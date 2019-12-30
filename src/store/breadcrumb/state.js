import {getCacheData} from "../../utils/cache";
let cache = JSON.parse(getCacheData('breadCrumb'));

export default {
  breadcrumb:cache || []
}

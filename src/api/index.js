import utils from '@/lib/utils';
import wepy from 'wepy';
export default class api extends wepy.mixin {
  data = {
    BASEURL: ''
  };
  mixins = [utils];
  
}

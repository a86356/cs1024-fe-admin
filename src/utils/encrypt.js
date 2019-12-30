import JsEncrypt from 'jsencrypt'

export default {
  encrypt(pas){
    let jse = new JsEncrypt();
    //设置公钥
    jse.setPublicKey('-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQChdK43kKRy5owp7/1wsMwnjIac1+YOmT8f5WrAoVXfiyAcgyUrg30SISYA8lPSG1MDKgqICkbSaGPzLUvNp6pahxbKWqTgNzDhEin9OP0CHDkbvl/agSBjkMHwz6eeZfOpSXBbT6H+/6VjTje04ckBdQoj0svl9FhUXXd7i/HjnwIDAQAB-----END PUBLIC KEY-----');

    //加密
    return  jse.encrypt(pas);
  }
}

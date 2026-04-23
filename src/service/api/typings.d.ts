declare namespace API {
  type DeleteRequest = {
    id?: number
  }

  type getPictureVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getSpaceVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type ImageSearchResult = {
    fromUrl?: string
    thumbUrl?: string
  }

  type LoginUserVO = {
    createTime?: string
    editTime?: string
    id?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type PagePicture_ = {
    current?: number
    pages?: number
    records?: Picture[]
    size?: number
    total?: number
  }

  type PagePictureVO_ = {
    current?: number
    pages?: number
    records?: PictureVO[]
    size?: number
    total?: number
  }

  type PageSpace_ = {
    current?: number
    pages?: number
    records?: Space[]
    size?: number
    total?: number
  }

  type PageSpaceVO_ = {
    current?: number
    pages?: number
    records?: SpaceVO[]
    size?: number
    total?: number
  }

  type PageUserVO_ = {
    current?: number
    pages?: number
    records?: UserVO[]
    size?: number
    total?: number
  }

  type Picture = {
    category?: string
    createTime?: string
    editTime?: string
    id?: number
    introduction?: string
    isDelete?: number
    name?: string
    picColor?: string
    picFormat?: string
    picHeight?: number
    picScale?: number
    picSize?: number
    picWidth?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    spaceId?: number
    tags?: string
    thumbnailUrl?: string
    updateTime?: string
    url?: string
    userId?: number
  }

  type PictureEditBatchDTO = {
    category?: string
    nameRule?: string
    pictureIds?: number[]
    spaceId?: number
    tags?: string[]
  }

  type PictureEditDTO = {
    category?: string
    id?: number
    introduction?: string
    name?: string
    tags?: string[]
  }

  type PictureQueryDTO = {
    category?: string
    current?: number
    endEditTime?: string
    id?: number
    introduction?: string
    name?: string
    nullSpace?: boolean
    pageSize?: number
    picFormat?: string
    picHeight?: number
    picScale?: number
    picSize?: number
    picWidth?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    searchText?: string
    sortField?: string
    sortOrder?: string
    spaceId?: number
    startEditTime?: string
    tags?: string[]
    userId?: number
  }

  type PictureReviewDTO = {
    id?: number
    reviewMessage?: string
    reviewStatus?: number
  }

  type PictureTagCategoryVO = {
    categoryList?: string[]
    tagList?: string[]
  }

  type PictureUpdateDTO = {
    category?: string
    id?: number
    introduction?: string
    name?: string
    tags?: string[]
  }

  type PictureUploadBatchDTO = {
    count?: number
    namePrefix?: string
    searchText?: string
  }

  type PictureUploadDTO = {
    id?: number
    picName?: string
    spaceId?: number
    url?: string
  }

  type PictureVO = {
    category?: string
    createTime?: string
    editTime?: string
    id?: number
    introduction?: string
    name?: string
    picColor?: string
    picFormat?: string
    picHeight?: number
    picScale?: number
    picSize?: number
    picWidth?: number
    spaceId?: number
    tags?: string[]
    thumbnailUrl?: string
    updateTime?: string
    url?: string
    user?: UserVO
    userId?: number
  }

  type ResultBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type ResultInt_ = {
    code?: number
    data?: number
    message?: string
  }

  type ResultListImageSearchResult_ = {
    code?: number
    data?: ImageSearchResult[]
    message?: string
  }

  type ResultListPictureVO_ = {
    code?: number
    data?: PictureVO[]
    message?: string
  }

  type ResultListSpaceLevel_ = {
    code?: number
    data?: SpaceLevel[]
    message?: string
  }

  type ResultLoginUserVO_ = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type ResultLong_ = {
    code?: number
    data?: number
    message?: string
  }

  type ResultPagePicture_ = {
    code?: number
    data?: PagePicture_
    message?: string
  }

  type ResultPagePictureVO_ = {
    code?: number
    data?: PagePictureVO_
    message?: string
  }

  type ResultPageSpace_ = {
    code?: number
    data?: PageSpace_
    message?: string
  }

  type ResultPageSpaceVO_ = {
    code?: number
    data?: PageSpaceVO_
    message?: string
  }

  type ResultPageUserVO_ = {
    code?: number
    data?: PageUserVO_
    message?: string
  }

  type ResultPictureTagCategoryVO_ = {
    code?: number
    data?: PictureTagCategoryVO
    message?: string
  }

  type ResultPictureVO_ = {
    code?: number
    data?: PictureVO
    message?: string
  }

  type ResultSpaceVO_ = {
    code?: number
    data?: SpaceVO
    message?: string
  }

  type ResultString_ = {
    code?: number
    data?: string
    message?: string
  }

  type ResultUser_ = {
    code?: number
    data?: User
    message?: string
  }

  type ResultUserVO_ = {
    code?: number
    data?: UserVO
    message?: string
  }

  type SearchPictureByColorDTO = {
    picColor?: string
    spaceId?: number
  }

  type SearchPictureByPictureDTO = {
    pictureId?: number
  }

  type Space = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
    totalCount?: number
    totalSize?: number
    updateTime?: string
    userId?: number
  }

  type SpaceAddDTO = {
    spaceLevel?: number
    spaceName?: string
  }

  type SpaceEditDTO = {
    id?: number
    spaceName?: string
  }

  type SpaceLevel = {
    maxCount?: number
    maxSize?: number
    text?: string
    value?: number
  }

  type SpaceQueryDTO = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    spaceLevel?: number
    spaceName?: string
    userId?: number
  }

  type SpaceUpdateDTO = {
    id?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
  }

  type SpaceVO = {
    createTime?: string
    editTime?: string
    id?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
    totalCount?: number
    totalSize?: number
    updateTime?: string
    user?: UserVO
    userId?: number
  }

  type uploadPictureUsingPOSTParams = {
    id?: number
    picName?: string
    spaceId?: number
    url?: string
  }

  type User = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userProfile?: string
    userRole?: string
  }

  type UserAddDTO = {
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserLoginDTO = {
    userAccount?: string
    userPassword?: string
  }

  type UserQueryDTO = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    userAccount?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserRegisterDTO = {
    checkPassword?: string
    userAccount?: string
    userPassword?: string
  }

  type UserUpdateDTO = {
    id?: number
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserVO = {
    createTime?: string
    id?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }
}

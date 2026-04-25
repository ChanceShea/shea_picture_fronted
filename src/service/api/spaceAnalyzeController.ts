// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** getSpaceCategoryAnalyze POST /api/space/analyze/category */
export async function getSpaceCategoryAnalyzeUsingPost(
  body: API.SpaceCategoryAnalyzeDTO,
  options?: { [key: string]: any }
) {
  return request<API.ResultListSpaceCategoryAnalyzeVO_>('/api/space/analyze/category', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getSpaceRankAnalyze POST /api/space/analyze/rank */
export async function getSpaceRankAnalyzeUsingPost(
  body: API.SpaceRankAnalyzeDTO,
  options?: { [key: string]: any }
) {
  return request<API.ResultListSpace_>('/api/space/analyze/rank', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getSpaceSizeAnalyze POST /api/space/analyze/size */
export async function getSpaceSizeAnalyzeUsingPost(
  body: API.SpaceSizeAnalyzeDTO,
  options?: { [key: string]: any }
) {
  return request<API.ResultListSpaceSizeAnalyzeVO_>('/api/space/analyze/size', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getSpaceTagAnalyze POST /api/space/analyze/tag */
export async function getSpaceTagAnalyzeUsingPost(
  body: API.SpaceTagAnalyzeDTO,
  options?: { [key: string]: any }
) {
  return request<API.ResultListSpaceTagAnalyzeVO_>('/api/space/analyze/tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getSpaceUsageAnalyzeVO POST /api/space/analyze/usage */
export async function getSpaceUsageAnalyzeVoUsingPost(
  body: API.SpaceUsageAnalyzeDTO,
  options?: { [key: string]: any }
) {
  return request<API.ResultSpaceUsageAnalyzeVO_>('/api/space/analyze/usage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getSpaceUserAnalyze POST /api/space/analyze/user */
export async function getSpaceUserAnalyzeUsingPost(
  body: API.SpaceUserAnalyzeDTO,
  options?: { [key: string]: any }
) {
  return request<API.ResultListSpaceUserAnalyzeVO_>('/api/space/analyze/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

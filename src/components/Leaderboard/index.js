import {useEffect, useState} from 'react'
import Loader from 'react-loader-spinner'
import LeaderboardTable from '../LeaderboardTable'
import {
  LeaderboardContainer,
  LoadingViewContainer,
  ErrorMessage,
} from './styledComponents'

const Leaderboard = () => {
  const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE',
  }

  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  })

  useEffect(() => {
    getLeaderBoardData()
  }, [])

  const getLeaderBoardData = async () => {
    setApiResponse({
      status: apiStatusConstants.inProgress,
      data: null,
      errorMsg: null,
    })

    const url = 'https://apis.ccbp.in/leaderboard'
    const options = {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU',
      },
    }
    const response = await fetch(url, options)
    const responseData = await response.json()
    if (response.ok) {
      setApiResponse({
        status: apiStatusConstants.success,
        data: responseData,
        errorMsg: null,
      })
    } else {
      setApiResponse({
        status: apiStatusConstants.failure,
        data: null,
        errorMsg: responseData.error_msg,
      })
    }
  }

  const renderLoadingView = () => (
    <LoadingViewContainer>
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </LoadingViewContainer>
  )

  const renderSuccessView = () => {
    const {data} = apiResponse
    const formatData = data.leaderboard_data.map(each => ({
      id: each.id,
      rank: each.rank,
      profileImgUrl: each.profile_imgUrl,
      name: each.name,
      score: each.score,
      language: each.language,
      timeSpent: each.time_spent,
    }))
    return <LeaderboardTable leaderboardData={formatData} />
  }

  const renderFailureView = () => {
    const {errorMsg} = apiResponse
    return <ErrorMessage> {errorMsg} </ErrorMessage>
  }
  const renderLeaderboard = () => {
    const {status} = apiResponse
    switch (status) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return <LeaderboardContainer>{renderLeaderboard()}</LeaderboardContainer>
}

export default Leaderboard

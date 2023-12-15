import { AppDispatch, RootStateType } from "types/index";
import styles from "./index.module.scss"
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getPending_changes_status, setPending_changes_status } from "reduxFolder/slices/marketingWebPage.slice";
import { generateWebpageData } from "reduxFolder/slices/marketingWebPage.slice";
import { getlastWebsitePreBuildStatus, getlastWebsiteBuildStatus } from "reduxFolder/slices/marketingWebPage.slice";


const UpdateDataTriggerBanner = () => {
  const dispatch = useDispatch<AppDispatch>()
  const pending_changes = useSelector((state: RootStateType) => state.marketingWebPage.pending_changes)
  const generateWebpageDataStatus = useSelector((state: RootStateType) => state.marketingWebPage.generateWebpageDataStatus)


  const onUpdate = () => {
    if (generateWebpageDataStatus !== "loading") {
      dispatch(generateWebpageData())
        .then(() => {
          dispatch(setPending_changes_status({
            pending_changes: false
          }))
          // dispatch(getlastWebsitePreBuildStatus());
          // dispatch(getlastWebsiteBuildStatus());
          setUpdateMoment()
        })
    }
  }

  const setUpdateMoment = () => {
    localStorage.setItem("updateMoment", (new Date()).toISOString())
  }


  useEffect(() => {
    dispatch(getPending_changes_status())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!pending_changes) return




  return (
    <div className={styles.container}>
      <svg width="5" height="30" viewBox="0 0 5 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.574219 0.816406H4.08984L3.85547 19.6445H0.808594L0.574219 0.816406ZM2.33203 29.1953C1.08203 29.1953 0.105469 28.2188 0.105469 26.9688C0.105469 25.6992 1.08203 24.7422 2.33203 24.7422C3.60156 24.7422 4.55859 25.6992 4.55859 26.9688C4.55859 28.2188 3.60156 29.1953 2.33203 29.1953Z" fill="#333333" />
      </svg>
      <div className={styles.dataBlock}>
        Updated content doesn't match the website. <br /> Please synchronize.
        <span onClick={onUpdate} className={styles.link}>
          <svg className={styles.icon} width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M2.02992 8.2835C2.02992 11.5304 4.38406 13.7427 7.02832 14.2003C7.10025 14.2128 7.16902 14.2393 7.23071 14.2783C7.29239 14.3174 7.34578 14.3682 7.38782 14.4279C7.42987 14.4875 7.45975 14.5549 7.47576 14.6261C7.49177 14.6974 7.49359 14.771 7.48112 14.843C7.46866 14.9149 7.44214 14.9837 7.4031 15.0453C7.36406 15.107 7.31324 15.1604 7.25357 15.2025C7.19389 15.2445 7.12652 15.2744 7.05529 15.2904C6.98407 15.3064 6.91039 15.3082 6.83846 15.2958C3.73339 14.7582 0.918457 12.1406 0.918457 8.2835C0.918457 6.64403 1.66406 5.3555 2.53446 4.3763C3.15846 3.67443 3.87206 3.10376 4.44592 2.6675H2.70086C2.55941 2.6675 2.42375 2.61131 2.32373 2.51129C2.22371 2.41127 2.16752 2.27561 2.16752 2.13416C2.16752 1.99271 2.22371 1.85706 2.32373 1.75704C2.42375 1.65702 2.55941 1.60083 2.70086 1.60083H5.90086C6.04231 1.60083 6.17796 1.65702 6.27798 1.75704C6.378 1.85706 6.43419 1.99271 6.43419 2.13416V5.33416C6.43419 5.47561 6.378 5.61127 6.27798 5.71129C6.17796 5.81131 6.04231 5.8675 5.90086 5.8675C5.75941 5.8675 5.62375 5.81131 5.52373 5.71129C5.42371 5.61127 5.36752 5.47561 5.36752 5.33416V3.3651L5.36646 3.36723C4.75632 3.8259 4.01179 4.38803 3.36646 5.11443C2.60379 5.97203 2.02992 7.0099 2.02992 8.2835ZM13.8785 8.71656C13.8785 5.50376 11.5745 3.30536 8.96432 2.8147C8.89158 2.80235 8.82201 2.77565 8.7597 2.73613C8.69738 2.69662 8.64356 2.64509 8.60136 2.58456C8.55917 2.52402 8.52946 2.45569 8.51396 2.38355C8.49846 2.31141 8.49747 2.2369 8.51107 2.16438C8.52467 2.09186 8.55258 2.02277 8.59316 1.96114C8.63374 1.89952 8.68619 1.84659 8.74745 1.80545C8.8087 1.76431 8.87754 1.73578 8.94993 1.72153C9.02233 1.70727 9.09684 1.70758 9.16912 1.72243C12.2347 2.29843 14.9899 4.9011 14.9899 8.71656C14.9899 10.356 14.2443 11.6435 13.3739 12.6238C12.7499 13.3256 12.0363 13.8963 11.4625 14.3326H13.2075C13.349 14.3326 13.4846 14.3888 13.5846 14.4888C13.6847 14.5888 13.7409 14.7244 13.7409 14.8659C13.7409 15.0073 13.6847 15.143 13.5846 15.243C13.4846 15.343 13.349 15.3992 13.2075 15.3992H10.0075C9.86607 15.3992 9.73042 15.343 9.6304 15.243C9.53038 15.143 9.47419 15.0073 9.47419 14.8659V11.6659C9.47419 11.5244 9.53038 11.3888 9.6304 11.2888C9.73042 11.1888 9.86607 11.1326 10.0075 11.1326C10.149 11.1326 10.2846 11.1888 10.3846 11.2888C10.4847 11.3888 10.5409 11.5244 10.5409 11.6659V13.6339H10.543C11.1521 13.1731 11.8977 12.612 12.5419 11.8846C13.3046 11.028 13.8785 9.99123 13.8785 8.71656Z" fill="#00538E" />
          </svg>
          {generateWebpageDataStatus === "loading" ? "Updating..." : "Update"}
        </span>
      </div>
    </div >
  )
}

export default UpdateDataTriggerBanner



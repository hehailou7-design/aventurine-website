import json, os, base64, requests, time

TOKEN = os.environ.get('GH_TOKEN', '')
OWNER = 'hehailou7-design'
REPO = 'aventurine-website'
DIST_DIR = r"C:\Users\Administrator\WorkBuddy\2026-06-09-23-31-31\aventurine-fan-site\dist"
API = f"https://api.github.com/repos/{OWNER}/{REPO}"
HEADERS = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
}

def api(method, path, data=None):
    url = f"{API}{path}"
    for attempt in range(3):
        try:
            if method == "GET":
                resp = requests.get(url, headers=HEADERS, timeout=30)
            elif method == "POST":
                resp = requests.post(url, headers=HEADERS, json=data, timeout=180)
            elif method == "PATCH":
                resp = requests.patch(url, headers=HEADERS, json=data, timeout=30)
            else:
                raise ValueError(f"Bad: {method}")
            if resp.status_code >= 400:
                print(f"  ERROR {resp.status_code}: {resp.text[:300]}")
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            print(f"  ERR (attempt {attempt+1}): {e}")
            if attempt < 2:
                time.sleep(2)

# Step 1
print("Step 1: Get gh-pages ref")
try:
    ref_info = api("GET", "/git/ref/heads/gh-pages")
    parent_sha = ref_info["object"]["sha"]
    print(f"  SHA: {parent_sha[:7]}")
except Exception as e:
    print(f"  No gh-pages: {e}")
    parent_sha = None

# Step 2: Upload dist files
print("\nStep 2: Create blobs")
blobs = []
files = []
for root, dirs, filenames in os.walk(DIST_DIR):
    for fname in filenames:
        fpath = os.path.join(root, fname)
        relpath = os.path.relpath(fpath, DIST_DIR).replace("\\", "/")
        files.append((relpath, fpath))

for relpath, fpath in sorted(files, key=lambda x: os.path.getsize(x[1])):
    fsize = os.path.getsize(fpath)
    print(f"  {relpath} ({fsize/1024:.1f} KB)")
    with open(fpath, "rb") as f:
        content = f.read()
    blob_data = {"content": base64.b64encode(content).decode(), "encoding": "base64"}
    try:
        blob_resp = api("POST", "/git/blobs", blob_data)
        blobs.append({"path": relpath, "mode": "100644", "type": "blob", "sha": blob_resp["sha"]})
        print(f"    OK SHA:{blob_resp['sha'][:7]}")
    except Exception as e:
        print(f"    FAIL: {e}")
        raise

print(f"\nCreated {len(blobs)} blobs")

# Step 3: Create tree (NO base_tree - fresh tree from dist only)
print("\nStep 3: Create tree (fresh, no base_tree)")
tree_data = {"tree": blobs}
tree_resp = api("POST", "/git/trees", tree_data)
tree_sha = tree_resp["sha"]
print(f"Tree SHA: {tree_sha[:7]}")

# Step 4: Commit
print("\nStep 4: Commit")
commit_data = {
    "message": "Deploy: major update support records + detail enh + cute decor",
    "tree": tree_sha,
}
if parent_sha:
    commit_data["parents"] = [parent_sha]
commit_resp = api("POST", "/git/commits", commit_data)
commit_sha = commit_resp["sha"]
print(f"Commit: {commit_sha[:7]}")

# Step 5: Update ref
print("\nStep 5: Update gh-pages ref")
ref_data = {"sha": commit_sha, "force": True}
try:
    api("PATCH", "/git/refs/heads/gh-pages", ref_data)
    print("Updated!")
except Exception as e:
    print(f"PATCH fail, try POST: {e}")
    api("POST", "/git/refs", {"ref": "refs/heads/gh-pages", "sha": commit_sha})
    print("Created!")

print("\nDONE - https://aventurine0505.xyz/")
